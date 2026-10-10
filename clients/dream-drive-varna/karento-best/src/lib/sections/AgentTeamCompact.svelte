<script lang="ts">
  import AgentTeam from "./AgentTeam.svelte";
  import { teamMembersCompact2 } from "#lib/data/editorial.ts";
</script>

<AgentTeam items={teamMembersCompact2} class="pb-0" />
