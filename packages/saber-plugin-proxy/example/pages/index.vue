<template>
    <button v-on:click="fetchApi">Fetch /api and get response from server configured in proxy configuration</button>
</template>

<script>
export default {
    methods: {
        async fetchApi() {
            const response = await fetch('/api');
            const responseText = await response.text();
            alert(responseText);
        }
    }
}
</script>