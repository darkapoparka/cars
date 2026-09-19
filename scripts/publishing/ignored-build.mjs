// Vercel Ignored Build Step: exit 0 only for a proven docs-only diff.
// All uncertainty (missing SHAs, missing .git, Git errors) exits 1: BUILD.
export const excludedPaths = [':!docs/**', ':!audits/**', ':!evidence/**', ':!qa/**', ':!README.md', ':!AGENTS.md', ':!CLIENT.md', ':!DEPLOYMENT.md'];
export const safeIgnoreBuildCommand = 'p=$VERCEL_GIT_PREVIOUS_SHA;c=$VERCEL_GIT_COMMIT_SHA; [ -n "$p" ] && [ -n "$c" ] && git diff --quiet "$p" "$c" -- . ' + excludedPaths.map(p => "'" + p + "'").join(' ') + ' && exit 0; exit 1';
if (safeIgnoreBuildCommand.length > 256) throw new Error('Vercel limits ignored-build commands to 256 characters');
