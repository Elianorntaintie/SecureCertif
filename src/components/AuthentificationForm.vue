<template>
  <div class="container monda-font animate__animated animate__fadeInDown">
    <nav>
      <h1 style="color: rgba(6, 40, 61, 1);">S-<span style="color: #F2994A;">certif</span></h1>
    </nav>
    <div>
      <h2 class="monda-font">Connexion</h2>
      <p class="stext monda-font">Retrouver l’activité de vos certificats dans un seul<br>endroit</p>
    </div>
    <form @submit.prevent="login">
      <div class="input-field">
        <div><label for="email">Téléphone/Email</label></div>
        <input id="contact" v-model="contact" required>
      </div>
      <div class="input-field">
        <div><label for="password">Mot de passe</label></div>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div>
        <a class="mot" href="">Mot de passe oublié ?</a>
        <button class="btn" type="submit" :disabled="loading">
          <span class="loading-indicator" v-if="loading"></span>
          <span v-else>Connexion</span>
        </button>
      </div>
    </form>
    <!-- <p class="pas">Pas de compte ? <router-link to="/createAccount">Inscription</router-link></p> -->
  </div>
</template>

<script>
import { firestore } from '@/config/firebaseConfig';
import { getDocs, collection, query, where, } from 'firebase/firestore';

import bcryptjs from 'bcryptjs';
import { TABLE } from '@/config/constantes/tables';

export default {
  data() {
    return {
      contact: "",
      password: "",
      loading: false,
      isAuthenticated: false,
      userId: null
    };
  },

  methods: {
    async login() {
      this.loading = true;

      // Recherche de l'utilisateur correspondant à l'email fourni dans Firestore
      const usersRef = collection(firestore, TABLE.USER);
      const q = query(usersRef, where('contact', '==', this.contact));

      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          // L'utilisateur n'a pas été trouvé
          alert("L'utilisateur n'existe pas");
        } else {
          // L'utilisateur a été trouvé, vérification du mot de passe
          const user = querySnapshot.docs[0].data();
          if (bcryptjs.compareSync(this.password, user.password)) {
            // Mot de passe correct, connexion de l'utilisateur
            localStorage.setItem('isAuthenticated', true);
            localStorage.setItem('userId', user._id); // Remplacez userId par l'ID de l'utilisateur connecté
            this.isAuthenticated = true;
            this.userId = user._id;
            this.$router.push("/mesVehicules");
          } else {
            // Mot de passe incorrect
            alert('Mot de passe incorrect');
          }
        }
      } catch (error) {
        // Gérer les erreurs lors de la connexion de l'utilisateur
        console.error("Erreur lors de la recherche de l'utilisateur : ", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 25px;
  font-weight: bold;
  color: rgba(6, 40, 61, 1);
}

.stext {
  color: rgba(0, 0, 0, 0.2);
  font-size: 13px;
  margin-top: -20px;
}

.container {
  text-align: left;
  width: 450px;
  height: 450px;
  margin: auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2) !important;
  padding: 15px;
  margin-top: 120px;
}

form {
  width: 100%;
  margin-top: 20px;
}

.monda-font {
  font-family: 'Monda', sans-serif;
}

.input-field {}

input {
  width: 98%;
  height: 30px;
  border: none;
  background: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  outline: none;
  margin-top: 5px;

}

input:nth-child(2) {
  margin-bottom: 20px;
}

label {
  font-weight: 700;
  font-size: 16px;
  color: rgba(6, 40, 61, 1);

}

.mot {
  color: rgba(6, 40, 61, 1);
  font-weight: 500;
  font-size: 15px;
}

.btn {
  margin-top: 20px;
  font-size: 17px;
  background: rgba(51, 167, 226, 1);
  border: none;
  width: 100%;
  border-radius: 10px;
  height: 35px;
  color: white;
}

.pas {
  font-weight: 700;
  color: rgba(6, 40, 61, 1);
  font-size: 14px;
}

.pas a {
  text-decoration: none;
  color: rgb(214, 106, 5);
}

.loading-indicator::after {
  content: "";
  display: inline-block;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  border: 3px solid #06283D;
  border-top-color: #F2994A;
  border-bottom-color: #F2994A;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-indicator {
  display: flex;
  justify-content: center;
  height: 100px;
}
@media (max-width: 1200px) {
  .container {
  width: 90%;
  height: 450px;
  margin:0 !important;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2) !important;
  padding: 15px;
  padding-top: 120px
}
}
</style>