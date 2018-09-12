<template>
    <div class="about"> 
        <p>Hello {{ their_name }},This is about page</p>
        
    </div>
</template>


<script>
export default {
  name: "Skills",
  data() {
    return {
     their_name: this.$route.params.name
    }
  }
};
</script>
