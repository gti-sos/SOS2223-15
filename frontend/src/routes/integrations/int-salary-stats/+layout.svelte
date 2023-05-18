<script>
    import IntLocalEntities from "./intLocalEntities.svelte";
    import IntApiExt from "./intApiExt.svelte";
    import IntApiExt2 from "./intApiExt2.svelte";
</script>


<main>
    <slot></slot>
    <!--<IntLocalEntities></IntLocalEntities>-->
    <IntApiExt></IntApiExt>
    <hr>
    <IntApiExt2></IntApiExt2>
</main>