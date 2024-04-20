import api from '@/api';

export default {
  namespaced: true,
  state: {
    depots: [],
    selectedResponses: [],
    selectedDepotsId: []
  },
  mutations: {
    SET_DEPOTS(state, depots) {
      state.depots = depots;
    },
    SET_SELECTED_RESPONSES(state, selectedResponses) {
      state.selectedResponses = selectedResponses
    },
    SET_SHOW_DEPOT(state, id) {
      // On récupere le depot via l'id afin de savoir avec quel dépot, il faut afficher l'input
      const depot = state.depots.find((depot) => {
        return depot.id === id
      });
      if(depot) {
        depot.show = !depot.show
      }
    },
    SET_RAISON_FOR_SELECTED_RESPONSE(state, {depot, raison}) {
      // Parcourt l'ensemble des reponses selectionnées.
      state.selectedResponses.map((reponse) => {
        // Si la réponse fait parti du dépot
        if(reponse.depot === depot.id && !reponse.raison) {
          // On ajoute l'attribut "raison" avec la valeur
          reponse.raison = raison
        }
      });
    }
  },
  actions: {
    async chargerDepots({commit}) {
      commit('SET_DEPOTS', await api.demande_clinique.depots.all());
    }
  },
  getters: {
    depots: state => state.depots,
    selectedResponses: state => state.selectedResponses,
    checkIfDepotHasResponses: (state) => {
      // Permet de, en transmettant un id directement dans le getter, savoir si nous avons des réponses liées au depot
      return (id) => state.selectedResponses.find(reponse => reponse.depot === id && !reponse.raison);
    },
    // Permet de savoir si une réponse a été validée (donc si elle contient l'attribut "raison" + si elle est pas
    // null ou undefined
    checkIfResponseHasRaison: (state) => {
      return (id) => {
        return state.selectedResponses.find(reponse => reponse.id === id)?.raison;
      }
    }
  }
};