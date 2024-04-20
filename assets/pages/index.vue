<template>
  <div>
    <div class="mb-2">
      <h1 class="text-4xl font-bold">Bienvenue sur ma belle application</h1>
      <p class="text-xl">Listing des demandes cliniques</p>
    </div>
    <div class="flex gap-2 flex-col w-full">
      <div
          v-for="depot in depots"
          :key="depot.id"
          class="bg-white rounded-xl shadow-sm p-4"
      >
        <p class="text-base font-semibold">Titre: <span class="text-base text-gray-700 font-light">{{
            depot.titre
          }}</span></p>
        <p class="text-base font-semibold">Description: <span
            class="text-base text-gray-700 font-light">{{ depot.description }}</span></p>
        <p class="text-base font-semibold">Date de création: <span
            class="text-base text-gray-700 font-light">{{ depot.date_creation }}</span></p>
        <div class="my-4 p-2 border border-gray rounded-xl bg-gray-100 flex flex-col gap-2"
             v-if="depot.reponses.length">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                  @click="showInput(depot)" type="button" v-if="checkIfDepotHasResponses(depot.id)">Valider
          </button>
          <div v-if="depot.show && checkIfDepotHasResponses(depot.id)" class="">
            <div class="flex flex-col">
              <label for="raison">Raison</label>
              <input type="text" name="raison" id="raison" v-model="raison">
            </div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                    @click="submitRaison(depot)" type="button">Envoyer la raison
            </button>
          </div>
          <div v-for="reponse in depot.reponses" :key="reponse.id">
            <div class="border border-dashed border-2 bg-white px-4 py-2">
              <input type="checkbox" v-model="selectedResponses" v-if="!checkIfResponseHasRaison(reponse.id)" :value="reponse">
              <p class="text-base font-semibold text-green-500" v-if="checkIfResponseHasRaison(reponse.id)">Validé ({{reponse.raison}})</p>
              <p class="text-base font-semibold text-red-500">Type: <span
                  class="text-base text-gray-700 font-light">{{ getTypeLabel(reponse.type) }}</span></p>
              <p class="text-base font-semibold">Titre: <span
                  class="text-base text-gray-700 font-light">{{ reponse.titre }}</span></p>
              <p class="text-base font-semibold">Description: <span
                  class="text-base text-gray-700 font-light">{{ reponse.description }}</span></p>
              <p class="text-base font-semibold">Date de création: <span
                  class="text-base text-gray-700 font-light">{{ reponse.date_creation }}</span></p>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center" v-else>
          <p class="text-base font-semibold">Aucune réponse</p>
        </div>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                @click="$router.push(`/depots/${depot.id}`)">Répondre à la demande
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getLabel } from '@/enum/demande_clinique/reponse/type';

export default {
  name: 'Index',
  computed: {
    ...mapGetters({
      //On recupere tous les depots
      depots: 'demande_clinique/depots',
      // On verifie si le depot transmis avec un id possede des reponses
      checkIfDepotHasResponses: 'demande_clinique/checkIfDepotHasResponses',
      // On vérifie si les raisons liées à un depot ont une raison (ça sert a afficher le valider)
      checkIfResponseHasRaison: 'demande_clinique/checkIfResponseHasRaison',
    }),
    selectedResponses: {
      // On recupere le tableau de réponses checkées
      get() {
        return this.$store.getters["demande_clinique/selectedResponses"];
      },
      // Avec une checkbox, on insere dans un tableau les réponses checkées
      set(value) {
        this.$store.commit('demande_clinique/SET_SELECTED_RESPONSES', value);
      },
    },
  },
  methods: {
    getTypeLabel: getLabel,
    // Cette fonction sert a insérer dans le depot, un attribut "show" qui nous permet d'afficher la balise input de la raison
    showInput(depot) {
      this.$store.commit('demande_clinique/SET_SHOW_DEPOT', depot.id);
      this.$forceUpdate();
    },
    // Cette fonction sert a envoyer la raison écrit sur l'input dans un attribut "raison" dans les reponses selectionnées du depot
    submitRaison(depot) {
      this.$store.commit('demande_clinique/SET_RAISON_FOR_SELECTED_RESPONSE', {depot: depot, raison: this.raison})
      this.$store.commit('demande_clinique/SET_SHOW_DEPOT', depot.id);

      this.raison = '';
      this.$forceUpdate();
    }
  },
  data() {
    return {
      raison: ''
    }
  }
};
</script>