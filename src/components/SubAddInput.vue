<template>
  <div class="addSubInput">
    <input type="text" :value="dispValue">
    <i class="fa fa-plus" @click="add"></i>
    <i class="fa fa-minus" @click="sub"></i>
  </div>
</template>
<script>
export default {
  name: "SubAddInput",
  props: {
    "value": {
      type: Number,
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    "sub" () {
      this.dispValue--;
      this.$emit("changeValue", -1);
    },
    "add" () {
      this.dispValue++;
      this.$emit("changeValue", 1);
    }
  },
  computed:{
    dispValue(){
      return this.value;
    }
  }
}
</script>
<style scoped>
.addSubInput {
  position: relative;
  display: inline-block;
}

input {
  width: 150px;
  display: inline-block;
  padding-right: 40px;
}


i.fa-plus,
i.fa-minus {
  position: absolute;
  margin-top: 2px;
}

i.fa-plus {
  right: 5px;
  top: 0px;
}

i.fa-minus {
  right: 20px;
  top: 0px;
}
</style>
