<script>
    import IntLocalEntities from "./intLocalEntities.svelte";
    import IntApiExt from "./intApiExt.svelte";
</script>


<main>
    <slot></slot>
    <!--<IntLocalEntities></IntLocalEntities>-->
    <IntApiExt></IntApiExt>
</main>