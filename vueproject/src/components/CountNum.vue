<template>
    <div class="hello">
        <!-- <h1>{{ msg }}</h1> -->
        <div id="computer">
            <span>
                宽度：<input type="text" v-model="wide">
            </span>
            <span>
                高度：<input type="text" v-model="hight">
            </span>
            <el-row style="margin:4px auto">
                <el-button @click="count" type="primary" round style="width: 160px;margin-left: 50px;">计算</el-button>
            </el-row>
            <span>
                周长：<input type="text" v-model="perimeter">
            </span>
            <span>
                面积：<input type="text" v-model="area">
            </span>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'CountNum',
    data() {
        return {
            msg: 'count your num',
            wide: '',
            hight: '',
            perimeter: '',
            area: ''
        }
    },
    methods: {
        count() {
            this.perimeter = 2 * (this.wide * 1 + this.hight * 1)
            this.area = this.wide * this.hight
        }
    },
    mounted() {
        this.$emit("transfer", this.msg);
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#computer {
    display: flex;
    flex-direction: column;
}
</style>
  