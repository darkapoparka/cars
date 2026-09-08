param([Parameter(Mandatory=$true)][int[]]$ProcessIds)
if (-not ('CarsReadProcess' -as [type])) {
    Add-Type @'
using System;
using System.Runtime.InteropServices;
public static class CarsReadProcess {
  [DllImport("kernel32.dll", SetLastError=true)] static extern IntPtr OpenProcess(uint a, bool inherit, int pid);
  [DllImport("kernel32.dll")] static extern bool CloseHandle(IntPtr h);
  [DllImport("kernel32.dll", SetLastError=true)] static extern bool ReadProcessMemory(IntPtr h, IntPtr p, byte[] b, int s, out IntPtr n);
  [DllImport("ntdll.dll")] static extern int NtQueryInformationProcess(IntPtr h, int c, byte[] b, int s, out int n);
  static byte[] Read(IntPtr h, long p, int n) { var b=new byte[n]; IntPtr got; if(!ReadProcessMemory(h,new IntPtr(p),b,n,out got)||got.ToInt64()!=n)throw new Exception("Cannot read process memory"); return b; }
  public static string Cwd(int pid) {
    var h=OpenProcess(0x0410,false,pid); if(h==IntPtr.Zero)throw new Exception("Cannot open process");
    try { var b=new byte[48];int n;if(NtQueryInformationProcess(h,0,b,b.Length,out n)!=0)throw new Exception("Cannot query process");
      var peb=BitConverter.ToInt64(b,8);var parameters=BitConverter.ToInt64(Read(h,peb+0x20,8),0);
      var unicode=Read(h,parameters+0x38,16);var length=BitConverter.ToUInt16(unicode,0);var buffer=BitConverter.ToInt64(unicode,8);
      return System.Text.Encoding.Unicode.GetString(Read(h,buffer,length));
    } finally {CloseHandle(h);}
  }
}
'@
}
foreach($carPid in $ProcessIds) {
    $carProcess=Get-CimInstance Win32_Process -Filter "ProcessId=$carPid"
    [pscustomobject]@{PID=$carPid;Cwd=[CarsReadProcess]::Cwd($carPid);CommandLine=$carProcess.CommandLine}
}
