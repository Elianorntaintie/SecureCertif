<template>
    <div class="all">
        <side_barre />
        
        <div class="container">
            <div class="head">
                <router-link to="/ajouterV" class="new_car">
                    <img style="width: 50px; height: 50px; margin: auto 10px;" src="@/assets/icon.png" alt="">
                    <div style="margin: auto 10px; width: 500px;">
                        <h3>Ajouter un certificat</h3>
                        <p style="margin-top: -20px;">Suivez l'activité de votre certificat dès maintenant</p>
                    </div>
                    <img style="width: 35px; height: 35px; margin: auto 10px;" src="@/assets/arrow-right.png" alt="">
                </router-link>
            </div>
            <div>
                <h1 class="title" style="margin-top: 80px; color: #06283d;">Mes certificats</h1>
                <div v-if="loading" class="loading-indicator">
                    <!-- Indicateur de chargement, vous pouvez personnaliser cet élément -->
                </div>
                <div v-else- class="vList" style="margin-top: 40px;">
                    <router-link v-for="vehicle in vehicles" :key="vehicle.id" :to="'/detailsVehicule/' + vehicle._id"
                        class="car animate__animated animate__fadeInRight">
                        <div class="image" style="display: flex;">
                            <img v-for="image in vehicle.images.createdAt" :key="image.id" :src="image.url" alt="Image de la voiture"
                                style="width: 100%; margin-top: 10px; border-radius: 10px; height: auto;" />
                        </div>
                        <div style="padding: 0; border-bottom: 1px solid rgba(0, 0, 0, 0.1);">
                            <h4 style="color: #06283dc9;">{{ vehicle.id }} {{ vehicle.color }}</h4>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                            <span style="color: #06283dc9;">{{ vehicle.createdAt }} </span>
                            <span style="color: #06283dc9;"></span>
                        </div>
                    </router-link>

                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import side_barre from '@/components/layouts/side_barre.vue';
import { TABLE } from '@/config/constantes/tables.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';

export default {
    components: {
        side_barre,
    },
    data() {
        return {
            isAuthenticated: false,
            currentPage: 'profil',
            userId: null,
            vehicleId: null,
            vehicles: [],
            users: [],
            depenses: [],
            loading: false
        };
    },
    mounted() {
        try {
            const vehicleId = this.$route.params.id;
        this.fetchDepenses(vehicleId);
        this.getVehicleById(vehicleId);
            // ...
        } catch (error) {
            console.error('Erreur lors de la récupération des dépenses :', error);
        }
    },
    created() {
        // Récupérer les informations d'authentification depuis le localStorage
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const userId = localStorage.getItem('userId');

        // Mettre à jour les données du composant avec les informations récupérées
        this.isAuthenticated = isAuthenticated === 'true';
        this.userId = userId;

        if (this.isAuthenticated) {
            // Récupérer les véhicules associés à l'ID de l'utilisateur
            this.getVehicles();
            this.getUserInfos();
        }
    },
    methods: {
        showPage(page) {
            this.currentPage = page;
        },
        
        async getVehicles() {
            try {
                this.loading = true;
                // Création d'une requête filtrée pour récupérer les voitures de l'utilisateur connecté
                const vehiclesRef = collection(db, TABLE.CAR);
                const q = query(vehiclesRef, where('userId', '==', this.userId));
                const querySnapshot = await getDocs(q);

                this.vehicles = querySnapshot.docs.map((doc) => doc.data());
                this.loading = false; // Fin du chargement
                // Stocker les véhicules dans le localStorage
                localStorage.setItem('vehicleIds', JSON.stringify(this.vehicles.map((vehicle) => vehicle._id)));
                // Pour chaque véhicule, récupérer les dépenses associées
                this.vehicles.forEach((vehicle) => {
                    this.fetchDepenses(vehicle._id);
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des certificats :', error);
            }
        },
        async getUserInfos() {
            try {
                const usersRef = collection(db, TABLE.USER);
                const q = query(usersRef, where('userId', '==', this.userId));
                const querySnapshot = await getDocs(q);
                this.users = querySnapshot.docs.map(doc => doc.data());
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs :', error);
            }
        },
        // async fetchDepenses(vehicleId) {
        //     try {
        //         this.loading = true;
        //         const q = query(collection(db, TABLE.DEPENSE), where('vehiculeId', '==', vehicleId));
        //         const querySnapshot = await getDocs(q);
        //         this.depenses = querySnapshot.docs.map((doc) => doc.data());
        //         this.loading = false;
        //     } catch (error) {
        //         console.error('Erreur lors de la récupération des dépenses :', error);
        //     }
        // },
        // async findTypeDepense() {
        //     try {
        //         const q = query(collection(db, TABLE.TYPE_DEPENSE));
        //         const querySnapshot = await getDocs(q);
        //         this.typeDepenses = querySnapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
        //     } catch (error) {
        //         console.error('Erreur lors de la récupération des informations du véhicule :', error);
        //     }
        // }, 
        // findTypeDepenseById(id) {
        //     const typeDepense = this.typeDepenses.find(type => type._id === id);
        //     return typeDepense ? typeDepense.libelle : '';
        // }
    }
};
</script>
  
<style scoped>
@import url(https://fonts.googleapis.com/css2?family=Monda:wght@100;200;300;400;500;600;700&display=swap);

body {
    width: 100%;
    padding: 0;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.05);
    font-family: Monda;
}

.all {
    background-color: rgba(0, 0, 0, 0.05);
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    font-family: Monda;
}

.container {
    width: 40%;
    margin-left: 5%;
    background-color: white;
    padding: 20px;
    height: 94.6vh;
    overflow-y: auto;
    font-family: Monda;
}

.side_barre {
    width: 16%;
    background-color: #06283D;
}

.side_barre i {
    color: white;
    margin: auto 10px;
    font-size: 25px;

}

.side_barre h3 {
    color: white;
    width: 100px;
    text-align: left;
    padding-left: 15px;
    font-family: Monda;
}

.extra {
    width: 40%;
    background-color: white;
    height: 100vh;
    /* Hauteur fixe du conteneur */
    overflow-y: auto;
    padding: 20px;
}

.page {
    margin-top: 20px;
    background-color: transparent;
    width: 95%;
    height: 100vh;
    margin-left: 15px;
}

.new_car {
    width: 100%;
    display: flex;
    text-decoration: none;
    justify-content: space-between;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

.vList {

    width: 100%;
    font-family: Monda;

}

.car {
    background-color: rgba(0, 0, 0, 0.05);
    width: 95%;
    padding: 0 2.5%;
    display: block;
    text-decoration: none;
    margin: auto;
    border-radius: 15px;
    margin-top: 15px !important;
}

h3 {
    color: #06283D;
}

p {
    color: rgba(0, 0, 0, 0.2);
    font-size: 12px;
}

/*Scroll bar css*/
.container::-webkit-scrollbar {
    width: 0.1em;
    /* Largeur de la barre de défilement */
}

.extra::-webkit-scrollbar {
    width: 0.1em;
    /* Largeur de la barre de défilement */
}

.extra::-webkit-scrollbar-thumb {
    background-color: transparent;
    /* Couleur de la poignée de défilement */
}

.container::-webkit-scrollbar-thumb {
    background-color: transparent;
    /* Couleur de la poignée de défilement */
}

/*nav barre*/
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

li {
    display: inline;
    margin-right: 10px;
}

.head {
    width: 37.5%;
    position: fixed;
    top: 7px;
    background-color: #ffffff;
    z-index: 9999;
}

button {
    border: none;
    background: none;
    cursor: pointer;
    text-decoration: underline;
    width: 85%;
    margin-left: 15%;
    padding-left: 25px;

}

.loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    margin-top: 170px;
}

.loading-indicator::after {
    content: "";
    display: inline-block;
    width: 50px;
    height: 50px;
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

.selected {
    background-color: white;
    border-bottom-left-radius: 25px;
    transition: all 0.3s;
    color: #06283D !important;
    border-top-left-radius: 25px;
    /* Ajoutez ici vos styles personnalisés pour le bouton sélectionné */
}

.cont {
    width: 100%;
    display: block;
}

.cont1 {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.05);
    height: 300px;
    border-radius: 15px;
}

.cont2 {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
}

.cont2 div {
    background-color: rgba(0, 0, 0, 0.05);
    width: 49%;
    border-radius: 15px;
    height: 250px;
}

.cont3 {
    width: 100%;
    display: block;
    margin-top: 40px;

    padding-bottom: 40px !important;
}

.cont3 div {
    background-color: rgba(0, 0, 0, 0.05);
    width: 100%;
    border-radius: 15px;
    margin-top: 20px;
    height: 100px;
}

.profil {
    display: flex;
}

.profil img {
    border: 6px solid white;
    border-radius: 50%;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

.profil h1 {
    font-size: 22px;

}

.name {
    margin: auto 15px;
}

.pList {
    margin-top: 50px;
}

.list {
    display: block;
}

.list li {
    display: flex;
    margin-top: 25px;
    width: 100%;
    padding-bottom: 25px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.list li span {
    font-size: 18px;
    margin: auto 10px;
    color: #06283db7 !important;
}

.list li img {
    height: 30px !important;
}

.image img:nth-child(2) {
    border: 1px solid black;
    display: none;
}

.image img:nth-child(3) {
    display: none;
}
@media (max-width: 786px) {
  .container {
  width: 100%;
  margin:0 !important;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2) !important;
  padding: 15px;
}
.head {
    width: 93%;
}
.title{
    margin-top: 100px!important;
}
.all {
    display: block;
}
}
</style>