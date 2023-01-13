const Select2Vue = {
    template: `<div ref="selectRef" class="select2 select2-container select2-container--default select2-container--classic select2-container--below select2-container--focus">
    <div class="selection" @click="openSelect">
        <div class="select2-selection select2-selection--single">
        <input style="display:none;" class="select2-selection__rendered" type="button" ref="formInput" v-model="modelValue" :name="formname">
        <span className="select2-selection__rendered" :title="modelValue">{{text.map(a=>options[setIndex][a]).filter(b=>b!==null).join("; ")}}</span>
            <span class="select2-selection__arrow"><b></b></span>
        </div></div>
    <div class="select2-container select2-container--default select-container--open select2-container-dropdown">
    <div class="select2-dropdown select2-dropdown--below">
    <div class="select2-search select2-search--dropdown">
    <input
    class="select2-search__field"
    ref="findText"
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
    :data-index="index"
    :data-value="item.option[id]"
    :data-selected="index===setIndex"
    @click="select($event, item.index, 'click')"
    >{{text.map(a=>item.option[a]).filter(b=>b!==null).join("; ")}}</li>
    </ul></div></div></div></div>`,
    props: {
        modelValue: [String, Number],
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
        this.setFilter(this.options);
        const handleClick = (event) => {
            if (this.$refs.selectRef && !this.$refs.selectRef.contains(event.target)) {
                this.$refs.selectRef.classList.remove("select2-container--open");
            }
        };
        document.addEventListener("click", handleClick);
    },
    watch: {
        modelValue() {

            this.setIndex = this.filters.findIndex(i => i.option[this.id] === this.modelValue);
        },
        searchText(newtext) {
            if (newtext !== "") {
                this.filters = this.options.map((f, i) => {
                    const searchingText = this.text.map(a => f[a]).filter(b => b !== null).join("; ");
                    if (searchingText.toLocaleUpperCase().includes(newtext.toLocaleUpperCase())) {
                        return {
                            index: i,
                            option: f
                        };
                    };
                }).filter(f => f !== undefined);

                this.setIndex = this.filters.findIndex(i => i.option[this.id] === this.modelValue);
                if (this.setIndex == -1) {
                    this.setIndex = 0;
                }
                this.scrollHeightCenter();

            } else {
                this.setFilter(this.options);
                this.scrollHeightCenter();
            }
        }
    },
    methods: {
        async setFilter(newValue) {
            this.filters =
                newValue.map((e, i) => {
                    return {
                        index: i,
                        option: e
                    }
                });
            this.setIndex = this.filters.findIndex(i => i.option[this.id] === this.modelValue);
        },
        openSelect(event) {
            event.target.closest(".select2").classList.toggle("select2-container--open")
            this.searchText = "";
            this.$refs.findText.focus();
            this.scrollHeightCenter();
        },
        find(e, updown) {
            const lastIndex = this.filters.lastIndexOf(this.filters.at(-1));

            if (updown == "down") {
                switch (e.keyCode) {
                    case 107: console.log(e.target.value + 1e3);
                        break;
                    case 110:
                        e.preventDefault();
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
                        const filterIndex = this.filters[this.setIndex].index;
                        this.$emit('update:modelValue', this.options[filterIndex][this.id]);
                        this.$emit('change', this.options[filterIndex][this.id]);
                        this.$refs.selectRef.classList.remove("select2-container--open");

                        this.setFilter(this.options);
                        break;
                    case 110:
                        e.target.value += ".";
                        break;
                    case 27:
                        this.$refs.selectRef.classList.remove("select2-container--open");
                    case 38:
                        e.preventDefault();
                        this.setIndex = (this.setIndex === 0) ? lastIndex : this.setIndex - 1;
                        this.scrollHeightCenter();
                        break;
                    case 40:
                        e.preventDefault();
                        this.setIndex = (this.setIndex === lastIndex) ? 0 : this.setIndex + 1;
                        this.scrollHeightCenter();
                        break;
                    default:
                        break;
                }
            }
        },
        scrollHeightCenter() {
            this.$nextTick(() => {
                const $ref = this.$refs.ul.children[this.setIndex]
                const $refParent = $ref.parentElement;
                $refParent.scrollTop = $ref.offsetTop - $refParent.offsetTop - ($refParent.offsetHeight / 2 - $ref.offsetHeight / 2);
            })
        },
        select(event, i) {
            this.setIndex = i
            this.$emit('update:modelValue', this.options[i][this.id]);
            this.$emit('change', this.options[i][this.id]);
            this.selectElement = event.target;
            this.$refs.ul.scrollTop = event.target.offsetTop - this.$refs.ul.offsetTop - (this.$refs.ul.offsetHeight / 2 - event.target.offsetHeight / 2);
            this.$refs.selectRef.classList.remove("select2-container--open");
            this.setFilter(this.options);
        }
    },
    emits: ['change', 'update:modelValue']
}
