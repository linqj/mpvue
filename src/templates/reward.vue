<template>
  <div class="add-content">2222</div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {};
  },
  created() {
    let app = getApp();
  },
  mounted() {
    this.searchTeam();
  },
  computed: {
    ...mapState({
      // selectedName: state => state.trialMultiplestore.selectedName
    })
  },
  watch: {},
  // components: {},
  methods: {}
};
</script>

<style scoped>
</style>
