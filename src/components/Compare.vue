<template>
<!-- Comapre component  -->
  <div class="container overflow-scroll">
    <!-- Table to present selected designs with their respective parameters for comparison -->
    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th
            class="table-info"
            v-for="(headerItem, index) in header"
            :key="index"
          >
            {{ headerItem }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(content, index) in contents" :key="index">
          <td v-if="checked[index]">
            <img :src=images[index].src class="img-fluid" alt="...">
          </td>
          <td v-for="(items, i) in content" :key="i">
            <p v-if="checked[index]">{{ items }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/**
 * Compare component.
 * Contains a table of the selected designs with stage images.
 * @example <compare >
        header=[designHistory Header names list]
        contents=[Design History contents List]
        checked=[checked list]
        images=[Stage Images List]
      </compare>
 */
export default {
  name: "Table",
  props: {
    /**
     * The Array list of header names 
     */
    header: {
      type: Array,
      required: true,
    },
    /**
     * Dictionary of arrays. Each array consists of
     * contents from a design.
     */
    contents: {
      type: Object,
      required: true,
    },
    /**
     * Status of the comparison checkbox in the table.
     * @values [true, false]
     */
    checked: {
      type: Array,
      required: true,
    },
    /**
     * Array List of Stage images of all the designs. 
     */
    images: {
      type: Array,
      required: true,
    },
  },
};
</script>

