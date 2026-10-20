import assert from 'node:assert/strict';
// Exact same-source publisher continuation of the real READY F1rst MAIN pilot.
// Raw source, six template pins, native input, facts/stock and raster pixels stay
// identical. The reviewed package carries the shared welcome CSS and metadata.
export const F1RST_SHARED_CONTROLS_EXPECTED={
  "dealer": "f1rst-motors",
  "repository": "darkapoparka/cars-f1rstmotors",
  "projectId": "prj_mavqUXCj6hSEg8EvBJW8G3XJlihm",
  "publicOrigin": "https://cars-f1rstmotors.vercel.app",
  "sourceCommit": "53a65e502e32f5e29c8332310753374194d17693",
  "sourceTree": "2e898661a8176a4f497c53f65eb7461633c21d1e",
  "privateMain": "f3d8c2011dc1a91b6b0eee534729f0e99cbd2b12",
  "templateSourceCommit": "bb173c33d7b640502ad2e4bf27546748c12858b8",
  "candidateLockSha256": "04633129df9e75d6cd62deeac9125b279957789d75f57cdb0b243ef61bfc3e7e",
  "nativeInput": {
    "digest": "dcad35257ad6a5a028d8ac7f4f24cf26005ba30c0b1aab001afba08aa391249c",
    "files": 9169
  },
  "templateSources": {
    "auto-best": {
      "repository": "darkapoparka/cars",
      "revision": "bb173c33d7b640502ad2e4bf27546748c12858b8",
      "path": "templates/auto-best",
      "tree": "78fa1a82eca14816449f9588283260840ee94f52",
      "digest": "2fc9c3cfc9cf1976dbe30c08592776362e5bcc6b09e8b06620e57c4406df58a5"
    },
    "modern": {
      "repository": "darkapoparka/cars",
      "revision": "bb173c33d7b640502ad2e4bf27546748c12858b8",
      "path": "templates/modern",
      "tree": "01eac7390fa6ba951d4b8d4c26159a9be150f6c8",
      "digest": "30e1a99f857cc25e4d78c9459cfb4394a9f70c5b114196a5ca6325ff38823b4b"
    },
    "import": {
      "repository": "darkapoparka/cars",
      "revision": "bb173c33d7b640502ad2e4bf27546748c12858b8",
      "path": "templates/import",
      "tree": "d841ddfe5bec918bf6b2c19fd6971fecd6b8e54d",
      "digest": "c7d6c93214e859aa2747af8f5e068b6a0b8ca095d6328c807728a4d531d688f8"
    },
    "app": {
      "repository": "darkapoparka/cars",
      "revision": "bb173c33d7b640502ad2e4bf27546748c12858b8",
      "path": "templates/app",
      "tree": "7f3d3ffa40546635377e6c5225194fe06fead291",
      "digest": "df336def57349fedfc4c425a00c7434c251735b90abb4636d0926290aafa7ed1"
    },
    "mobile": {
      "repository": "darkapoparka/cars",
      "revision": "bb173c33d7b640502ad2e4bf27546748c12858b8",
      "path": "templates/mobile",
      "tree": "792bfdd1d8eb22aabd90c7e3a0c0779a6c1c36f3",
      "digest": "f5a3e541a7c648a4c2899ad3893e22a3806027a9f66d95fa4e8c74b2226635b6"
    },
    "karento-best": {
      "repository": "darkapoparka/cars",
      "revision": "bb173c33d7b640502ad2e4bf27546748c12858b8",
      "path": "templates/karento-best",
      "tree": "8c5ac869c7fd15e19a80c660343fc64b20a2bad9",
      "digest": "be17ef365e3272753df6e50826b139a45bfc32b8fef54ddcb86d977ad16280a9"
    }
  },
  "packageTree": "e60e339503508a25883d439f96ae491651fbe8c0",
  "packageDigest": "ac937e1c9622f1c8b4953c1a02937dbac6adf24548c46feb811463dfeebb7a49",
  "payloadDigest": "55cab9fa51e68741ea614ed78a3393c62bf70e59f66c98f29c52f23812c78dce",
  "packageReceiptSha256": "3c38a497a62f1b30975fa54010846669b7899ef873415f1237d03881ebb87190",
  "priorProduction": {
    "deploymentId": "dpl_AozXMdGQKHGuTZhDwbZqkvJM2ST2",
    "gitCommit": "f3d8c2011dc1a91b6b0eee534729f0e99cbd2b12",
    "projectId": "prj_mavqUXCj6hSEg8EvBJW8G3XJlihm",
    "state": "READY",
    "target": "production",
    "gitBranch": "main",
    "publicOrigin": "https://cars-f1rstmotors.vercel.app",
    "serviceCount": 6,
    "providerReceiptSha256": "858a3d176d32f03b847efec8a18c44c6aa767ec5858e49da863b3751f36a6f99"
  }
};
export function assertF1rstSharedControlsSuccessor(pilot,{meta,manifest}={}){
 const e=F1RST_SHARED_CONTROLS_EXPECTED,check=(value,message)=>assert(value,'Exact F1rst shared-controls package successor: '+message);
 check(pilot?.schemaVersion===1&&pilot.kind==='cars-owner-authorized-f1rst-shared-controls-package-successor','explicit owner-authorized package continuation required');
 for(const key of Object.keys(e))assert.deepEqual(pilot[key],e[key],'Exact F1rst shared-controls package successor: lease changed '+key);
 check(manifest?.slug===e.dealer&&manifest.repository===e.repository&&manifest.shareIdentity?.publicOrigin===e.publicOrigin&&manifest.sourceOwnership!=='independent-repository','existing Cars-owned identity changed');
 assert.deepEqual(manifest.templateSources,e.templateSources,'Exact F1rst shared-controls package successor: six immutable template tuples changed');
 check(meta?.sourceCommit===e.sourceCommit&&meta.payloadDigest===e.payloadDigest,'reviewed actual package payload or immutable source changed');
 check(meta.qualification?.templateSourceCommit===e.templateSourceCommit&&meta.qualification.candidateLockSha256===e.candidateLockSha256,'selected master or lock changed');
 assert.deepEqual(meta.qualification.nativeInput,e.nativeInput,'Exact F1rst shared-controls package successor: native input changed');
 for(const key of ['ownerAuthorizedMain','rawSourceUnchanged','stockAndFactsUnchanged','selectedSourceRasterBytesUnchanged','productionBuildPending'])check(pilot[key]===true,'pending same-source production scope changed');
 check(pilot.hostedApproval===false,'new hosted acceptance remains pending');
}
