const { createApp } = Vue;

const xApp = createApp({
    components: {
        Select2Vue
    },
    methods: {
        async change() {
            await $.post("http://localhost/zirve/firmalar.php", { serverName: "ANAMAKINE\\ZRVSQL2008" }, async (res) => {
                this.klavuz.data = await res;
                this.klavuz2.data = await res;
            }, "json")
        }
    },
    async mounted() {
        await $.post("http://localhost/zirve/firmalar.php", async (res) => {
            this.klavuz.data = await res;
            this.klavuz2.data = await res;
        }, "json")
    },
    data() {
        return {
            data1: {
                data: [],
                value: "DARMSTADT",
                id: "klavuz",
                text: ["vergino", "klavuz"],
                onSelect($event) {
                    this.value = $event;
                }
            },
            data2: {
                data: [],
                value: "DARMSTADT",
                id: "klavuz",
                text: ["vergino", "klavuz"],
                onSelect($event) {
                    this.value = $event;
                }
            }
        }
    }
}).mount('#app');
