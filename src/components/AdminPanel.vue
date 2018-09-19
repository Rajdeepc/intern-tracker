<template>
    <div>
         <b-modal id="modallg" size="lg" title="Large Modal">
              <!-- <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                <b-form-group id="exampleInputGroup1" label="Email address:" label-for="exampleInput1" description="We'll never share your email with anyone else.">
                  <b-form-input id="exampleInput1" type="email" v-model="form.email" required placeholder="Enter email">
                  </b-form-input>
                </b-form-group>
                <b-form-group id="exampleInputGroup2" label="Your Name:" label-for="exampleInput2">
                  <b-form-input id="exampleInput2" type="text" v-model="form.name" required placeholder="Enter name">
                  </b-form-input>
                </b-form-group>
                <b-form-group id="exampleInputGroup3" label="Food:" label-for="exampleInput3">
                  <b-form-select id="exampleInput3" :options="foods" required v-model="form.food">
                  </b-form-select>
                </b-form-group>
                <b-button type="submit" variant="primary">Submit</b-button>
                <b-button type="reset" variant="danger">Reset</b-button>
              </b-form> -->
              <input type="text" class="form-control"/>
          </b-modal>
    </div>
</template>
<script>
export default {
    name:'AdminPanel',
    data(){
        return {}
    }
}
</script>

