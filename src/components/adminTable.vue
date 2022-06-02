<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Course Table</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          class="mb-2"
          @click="newItemOpen"
        >
          New Course
        </v-btn>
        <v-dialog
          v-model="dialog"
          max-width="1000px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <videoTableVue :courseId="courseId" />
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!--- add new modal -->
        <v-dialog
          v-model="dialogNew"
          max-width="500px"
        >
          <v-card>
            <v-card-title class="text-h5">New Course</v-card-title>
            <v-card-actions>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="newItem.name"
                      label="Course name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="addNew"
                    >OK</v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="closeNew"
                    >Cancel</v-btn>
                  </v-col>
                </v-row>
              </v-container>
              <v-spacer></v-spacer>

              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!--- delete modal -->
        <v-dialog
          v-model="dialogDelete"
          max-width="500px"
        >
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="closeDelete"
              >Cancel</v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="deleteItemConfirm"
              >OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import videoTableVue from "./videoTable.vue";
import { db } from "@/libs/firebase";
import { doc, setDoc, collection, deleteDoc } from "firebase/firestore";

export default {
  data: () => ({
    courseId: null,
    dialog: false,
    dialogDelete: false,
    newItemDialog: false,
    dialogNew: false,
    headers: [
      {
        text: "Course's Name",
        align: "start",
        sortable: false,
        value: "courseName",
      },
      { text: "Videos", value: "videoCount" },
      { text: "Members", value: "memberCount" },

      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    newItemIndex: -1,
    editedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    newItem: {
      name: "",
    },
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialogNew(val) {
      val || this.closeNew();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.desserts = this.$store.state.allCourse;
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.courseId = item.courseId;
    },

    async deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    newItemOpen(item) {
      this.newItemIndex = this.desserts.indexOf(item);
      this.newItem = Object.assign({}, item);
      this.dialogNew = true;
    },

    async deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);

      await deleteDoc(doc(db, "course", this.editedItem.courseId));
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeNew() {
      this.dialogNew = false;
      this.$nextTick(() => {
        this.newItem = Object.assign({}, this.newItem);
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },

    async addNew() {
      // Add a new document with a generated id
      const addNewQuery = doc(collection(db, "course"));
      // later...
      await setDoc(addNewQuery, { courseName: this.newItem.name });
    },
  },

  components: { videoTableVue },
};
</script>