<template>
    <div class="all">
        <div class="container">

            <div v-if="loading" class="loading-indicator">
                <!-- Indicateur de chargement, vous pouvez personnaliser cet élément -->
            </div>
            <div v-else>
                <div class="car">
                    <router-link to="/mesVehicules"><i style="margin-top: 15px; color: #06283dc9;"
                            class="fas fa-chevron-left"></i></router-link>
                    <div class="" style="display: block; padding-bottom: 20px;">
                        <div class="button-container" ref="buttonContainer">
                            <div class="image button-wrapper"
                                ref="this.$refs.buttonContainer.scrollLeft = this.scrollLeft - deltaX;">
                                <img class="slide" v-for="image in vehicle.images" :key="image.id" :src="image.url"
                                    alt="Image de la voiture"
                                    style="margin-top: 10px; border-radius: 10px; height: auto;" />
                            </div>
                        </div>

                    </div>
                </div>
                <div v-for="vehicle in vehicles" :key="vehicle.id" style="display: block;">
                    <h3 style="color: white; background-color: #06283dc9;  text-align: center; border-radius: 5px;">{{ vehicle.createdAt }}</h3>
                    <h3 style="color: white; background-color: #06283dc9;  text-align: center; border-radius: 5px;">{{vehicle.color }}</h3>
                    <h3 style="color: white; background-color: #06283dc9;  text-align: center; border-radius: 5px;">{{vehicle.annee }}</h3>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { TABLE } from '@/config/constantes/tables.js';


export default {
    components: {
    },
    data() {
        return {
            vehicle: [],
            loading: false,
            vehicles: [],
        };
    },
    mounted() {
        const vehicleId = this.$route.params.id;
        this.getVehicleById(vehicleId);
    },
    methods: {
        async getVehicleById(vehicleId) {
            try {
                this.loading = true;
                const q = query(collection(db, TABLE.CAR), where('_id', '==', vehicleId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    this.vehicle = querySnapshot.docs[0].data();
                    this.vehicles = querySnapshot.docs.map((doc) => doc.data());
                } else {
                    console.log('Le véhicule n\'existe pas.');
                }
                this.loading = false;
            } catch (error) {
                console.error('Erreur lors de la récupération du véhicule :', error);
            }
        },

    },
};
</script>
<style scoped>
@import url(https://fonts.googleapis.com/css2?family=Monda:wght@100;200;300;400;500;600;700&display=swap);

body {
    width: 100%;
    padding: 0;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.5) !important;
    font-family: Monda;
}

.car {
    background-color: rgba(0, 0, 0, 0.05);
    width: 95%;
    padding: 0 2.5%;
    display: block;
    margin: auto;
    border-radius: 15px;
}

.all {
    background-color: rgba(0, 0, 0, 0.05) !important;
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex !important;
    font-family: Monda;
}

.detail {
    width: 95%;
    margin: auto;
}

h3 {
    color: #06283D;
}

p {
    color: #06283D;
    font-size: 12px;
}

.head {
    width: 37.5%;
    position: fixed;
    top: 7px;
    background-color: #ffffff;
    z-index: 9999;
}

.new_car {
    width: 100%;
    display: flex;
    text-decoration: none;
    justify-content: space-between;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

ul {
    padding: 0;
    width: 100%;
}

li {
    width: 100%;
    list-style: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.container {
    width: 40%;
    margin: auto;
    background-color: white;
    padding: 20px;
    height: 94.6vh;
    overflow-y: auto;
    font-family: Monda;
}

.container::-webkit-scrollbar {
    width: 0.1em;
    /* Largeur de la barre de défilement */
}

.container::-webkit-scrollbar-thumb {
    background-color: transparent;
    /* Couleur de la poignée de défilement */
}

h4 {
    font-size: 15px;
    color: #06283D;
    display: flex;
}

p {
    width: 50%;
}


.loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    margin-top: 200px;
}

.loading-indicator::after {
    content: "";
    display: inline-block;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid #06283D;
    border-top-color: #F2994A;
    border-bottom-color: #F2994A;
    animation: spin 1s linear infinite;
}

.image {
    display: flex;
    justify-content: space-between;
}

.image img {
    width: 32% !important;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

span {
    color: #F2994A;
    font-weight: bold;
    margin: auto;
    width: 50%;
    text-align: right;
}
@media (max-width: 786px) {
  .container {
  width: 100%;
  margin:0 !important;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2) !important;
  padding: 15px;
}
}
</style>