<template>
     <div class="modal-backdrop" role="dialog">
      <div class="modalConfirm" ref="modal">
        <header class="modal-header">
          <slot name="header">
            <h4>
              Confirm Delete
            </h4>

            <button type="button" class="btn-close btn-right" @click="close" aria-label="Close modal">
              x
            </button>
          </slot>
        </header>

        <section class="modal-body text-center">
          <slot name="body">
           Are You sure you want to <br>Delete Project Assigned to {{emailObjToDelete}}
          </slot>
        </section>

        <footer class="modal-footer">
          <slot name="footer">
            <button type="button" class="btn btn-primary" @click="deleteProjectAgainstMember(emailObjToDelete)" aria-label="Delete And Close">
              Delete
            </button>
            <button type="button" class="btn btn-danger" @click="close" aria-label="Cancel modal">
              Cancel
            </button>
          </slot>
        </footer>
      </div>
    </div>
</template>

<script>
import DataPostApi from "../services/api/loginValidation";

export default {
  name: "confirmModal",
  props:["emailObjToDelete"],
  data() {
    return {};
  },
  methods: {
    close(event) {
      this.$emit('close');
    },
    deleteProjectAgainstMember(byEmail){
      DataPostApi.deleteProjectDocument(byEmail)
      .then(response => {
        console.log("Response from Delete Object" + response);
        this.$emit('close');
      })
      .catch(err => {
        console.log("Error from delete object" + err)
      })
    },
  }
};
</script>
<style scoped> 
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modalConfirm {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 8px;
  display: flex;
}

.modal-header {
  border-bottom: 1px solid #eeeeee;
  color: #4aae9b;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.modal-fade-enter,
.modal-fade-leave-active {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}

</style>
