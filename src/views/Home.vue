<template>
  <div class="home">
    <div v-if='"loggedIn"'>
      <button class=login @click="login()">Login</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from 'axios';
export default {
  name: "Home",
  data() {
    return {
    reservations: []
    }
  },
  computed: {
    userID: function() {
      return this.$root.$data.userID;
    },
  },
  methods: {
    async CreateReservationsForClient(userID) {
    let planes = this.$root.$data.aircraft;
    var i = 0;
    for(i = 0; i < planes.length; i++) {
      try {
        await axios.post("/api/reservations/" + userID, {
            userID: userID,
            hoursBooked: 0,
            aircraftID: planes[i].id
        });
      } catch (error) {
        console.log(error);
      }
    }
    },
    async login() {
      let results = await this.getReservations(this.$root.$data.userID);
      if(results.length === 0) {
      this.CreateReservationsForClient(this.$root.$data.userID);
      } //if there are no results,
    },
    async getReservations(userID) {
      try {
        const response = await axios.get("/api/reservations/" + userID);
        return response.data;
      } catch (error) {
        console.log(error);
        return 20;
      }
    },
  },
  
};
</script>

<style>

.login {
  margin-bottom: 20px;
}

</style>