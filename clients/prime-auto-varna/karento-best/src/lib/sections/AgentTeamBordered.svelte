<script lang="ts">
  import AgentTeam from "./AgentTeam.svelte";
  import { teamMembersCompact1 } from "#lib/data/editorial.ts";
</script>

<AgentTeam items={teamMembersCompact1} class="border-top border-bottom" />
