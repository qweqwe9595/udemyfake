<template>
  <v-data-table
    :headers="headers"
    :items="documents"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Course Table</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New Course
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.documentName"
                      label="Document Name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.path"
                      label="path"
                    ></v-text-field>
                  </v-col>
                </v-row>
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
import { db } from "@/libs/firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
export default {
  props: ["courseId"],
  data: () => ({
    documents: [],
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Document Name",
        align: "start",
        sortable: true,
        value: "documentName",
      },
      { text: "Path", value: "path", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      documentName: "",
      path: "",
    },
    defaultItem: {
      documentName: "",
      path: "",
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
    courseId: {
      handler() {
        this.getDocuments();
      },
      immediate: true,
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      // this.documents = this.$store.state.allCourse;
      this.documents = [{ documentName: "asdkljasdkj", path: "askdjasdkj" }];
    },

    editItem(item) {
      this.editedIndex = this.documents.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.documents.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.documents.splice(this.editedIndex, 1);
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

    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.documents[this.editedIndex], this.editedItem);
      } else {
        const addNewQuery = doc(collection(db, "document"));
        // later...
        await setDoc(addNewQuery, {
          courseId: this.courseId,
          documentName: this.editedItem.documentName,
          path: this.editedItem.path,
        });
      }
      this.getDocuments();
      this.close();
    },
    async getDocuments() {
      this.documents = [];
      const q = query(
        collection(db, "document"),
        where("courseId", "==", this.courseId)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        this.documents.unshift({ documentId: doc.data(), ...doc.data() });
      });
    },
  },
};
</script>