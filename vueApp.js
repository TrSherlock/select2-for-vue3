const { createApp } = Vue;

const xApp = createApp({
    components: {
        Select2Vue
    },
    methods: {
        async change() {
            console.log(this.klavuz.value);
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
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(json => {
                this.data2.data = json;
            })
    },
    watch: {
        value(newIndex) {
            console.log(newIndex);
        },
        updateValue(newValue) {
            console.log(newValue);
        }
    },
    data() {
        return {
            updateValue: "",
            klavuz: {
                ajax: {
                    url: "http://localhost/zirve/firmalar.php",
                    data: { serverName: "ANAMAKINE\\ZRVSQL2008" },
                    load (res) {
                        this.data = res
                    },
                    type: "json"
                },
                data: [],
                value: "DARMSTADT",
                id: "klavuz",
                text: ["vergino", "klavuz"],
                change() {
                    console.log(this.value);
                },
                onselect($event) {
                    this.value = $event;
                }
            },
            klavuz2: {
                data: [],
                value: "DARMSTADT",
                id: "klavuz",
                text: ["vergino", "klavuz"],
                change() {
                    console.log(this.value);
                },
                onselect($event) {
                    console.log($event);
                }
            },
            data2: {
                data: [],
                value: 5,
                id: "id",
                text: ["username", "name"],
                change() {
                    console.log(this.value)
                }
            }
        }
    }
}).component("select-3", {
    template: `<div ref="selectRef" class="select2 select2-container select2-container--default select2-container--classic select2-container--below select2-container--focus">
    <div class="selection" @click="openSelect">
        <div class="select2-selection select2-selection--single">
        <input style="display:none;" class="select2-selection__rendered" type="button" ref="formInput" v-model="modelValue" :name="formname">
        <span className="select2-selection__rendered" :title="modelValue">{{modelValue}}</span>
            <span class="select2-selection__arrow"><b></b></span>
        </div></div>
    <div class="select2-container select2-container--default select-container--open select2-container-dropdown">
    <div class="select2-dropdown select2-dropdown--below">
    <div class="select2-search select2-search--dropdown">
    <input
    class="select2-search__field"
    ref="findText"
    @change="change($event)"
    v-model="searchText"
    @keyup="find($event, 'up')"
    @keydown="find($event, 'down')">
    </div>
    <div class="select2-results">
    <ul class="select2-results__options" ref="ul" :data-index="setIndex">
    <li
    class="ow select2-results__option hover:bg-violet-300"
    :class="{ 'select2-results__option--highlighted': index===setIndex }"
    v-for="(item, index) in filters"
    :data-setIndex="setIndex"
    :data-index="index"
    :data-value="item[id]"
    :data-selected="index===setIndex"
    @click="select($event, index, 'click')"
    >{{text.map(a=>item[a]).filter(b=>b!==null).join("; ")}}</li>
    </ul></div></div></div></div>`,
    props: {
        modelValue: String,
        options: {
            type: Array
        },
        klavuz: { Object },
        formname: String,
        value: String,
        id: String,
        text: {
            type: Array
        }
    },
    data() {
        return {
            filters: [],
            setIndex: 0,
            searchText: "",
            selectElement: { Object }
        }
    },
    mounted() {
        this.setIndex = this.options.findIndex(i => i[this.id] === this.modelValue);
        this.setFilter(this.options);

        const handleClick = (event) => {
            if (this.$refs.selectRef && !this.$refs.selectRef.contains(event.target)) {
                this.$refs.selectRef.classList.remove("select2-container--open");
            }
        };

        document.addEventListener("click", handleClick);
    },
    watch: {
        options(newValue) {
            this.setFilter(newValue);
        },
        searchText(newtext) {
            if (newtext !== "") {
                this.filters = this.options.filter(f => {
                    const searchingText = this.text.map(a => f[a]).filter(b => b !== null).join("; ");
                    return searchingText.toLocaleUpperCase().includes(newtext.toLocaleUpperCase());
                })
                this.setIndex = this.filters.findIndex(i => i[this.id] === this.modelValue);
                if (this.setIndex == -1) {
                    this.setIndex = 0;
                }
            } else {
                this.filters = this.options;
                this.setIndex = this.options.findIndex(i => i[this.id] === this.modelValue);
            }
        }
    },
    methods: {
        setFilter(newValue) {
            this.filters = newValue;
        },
        change(e) {
            console.log(e.target.value)
        },
        openSelect(event) {
            event.target.closest(".select2").classList.toggle("select2-container--open")
            this.$refs.findText.focus();
        },
        find(e, updown) {
            const lastIndex = this.filters.lastIndexOf(this.filters.at(-1));
            if (updown == "down") {
                switch (e.keyCode) {
                    case 107: console.log(e.target.value + 1e3);
                        break;
                    case 38:
                        if (updown == "down") {
                            e.preventDefault();
                        }
                        break;
                    case 40:
                        if (updown == "down") {
                            e.preventDefault();
                        }
                        break;
                    default:
                        break;
                }
            } else {

                switch (e.keyCode) {
                    case 13:
                        this.$emit('update:modelValue', this.filters[this.setIndex][this.id]);
                        this.$refs.selectRef.classList.remove("select2-container--open");
                        break;
                    case 38:
                        e.preventDefault();
                        this.setIndex = (this.setIndex === 0) ? lastIndex : this.setIndex - 1;
                        this.scrollHeightCenter(this.$refs.ul.children[this.setIndex]);
                        break;
                    case 40:
                        e.preventDefault();
                        this.setIndex = (this.setIndex === lastIndex) ? 0 : this.setIndex + 1;
                        this.scrollHeightCenter(this.$refs.ul.children[this.setIndex]);
                        break;
                    default:
                        break;
                }
            }
        },
        scrollHeightCenter($ref) {
            const $refParent = $ref.parentElement;
            $refParent.scrollTop = $ref.offsetTop - $refParent.offsetTop - ($refParent.offsetHeight / 2 - $ref.offsetHeight / 2);
        },
        select(event, i, eventType) {
            this.setIndex = i
            this.$emit('update:modelValue', this.filters[i][this.id]);
            this.$emit('change', this.filters[i][this.id]);
            this.selectElement = event.target;
            this.$refs.ul.scrollTop = event.target.offsetTop - this.$refs.ul.offsetTop - (this.$refs.ul.offsetHeight / 2 - event.target.offsetHeight / 2);
            this.$refs.selectRef.classList.remove("select2-container--open");
        }
    },
    emits: ['change', 'update:modelValue']
}).mount('#app');


function scrollHeightCenter($ref) {
    const $refParent = $ref.parentElement
    $refParent.scrollTop = $ref.offsetTop - $refParent.offsetTop - ($refParent.offsetHeight / 2 - $ref.offsetHeight / 2);
}
