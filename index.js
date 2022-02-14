const State = class {
    constructor() {
        this.make_deck()
        this.set_cards()
        this.open_cards = []
        this.suit_array = [[], [], [], []]
    }

    make_deck = () => {
        this.deck = []
        const num_list = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
        const suit_list = ['s', 'h', 'd', 'c']
        num_list.forEach(num => {
            suit_list.forEach(suit => {
                this.deck.push(num + suit)
            });
        });
    }

    random_select = (array, num) => {
        let newArray = [];
        while (newArray.length < num && array.length > 0) {
            // 配列からランダムな要素を選ぶ
            const rand = Math.floor(Math.random() * array.length);
            // 選んだ要素を別の配列に登録する
            newArray.push(array[rand]);
            // もとの配列からは削除する
            array.splice(rand, 1);
        }
        return newArray
    }

    set_cards = () => {
        this.card_array = []
        for (let i = 0; i < 7; i++) {
            this.card_array.push(this.random_select(this.deck, i + 1))
        }

        this.deck = this.random_select(this.deck, this.deck.length)

        //各列にカードをセット
        for (let i = 0; i < 7; i++) {
            const len = this.card_array[i].length
            for (let j = 0; j < len - 1; j++) {
                $('#card_array' + i).append(`<img src="./cards/hidden.gif">`);
            }
            $('#card_array' + i).append(`<img src="./cards/${this.card_array[i][len - 1]}.gif">`);
        }

        $('#rest_deck').append(`<img src="./cards/hidden.gif">`);
    }

    //カードを移動可能か判定
    check_can_move = (src, dst) => {
        if ((src.substr(1, 1) == 's' || src.substr(1, 1) == 'c') && (dst.substr(1, 1) == 'h' || dst.substr(1, 1) == 'd') ||
            (src.substr(1, 1) == 'h' || src.substr(1, 1) == 'd') && (dst.substr(1, 1) == 's' || dst.substr(1, 1) == 'c')) {
            const num_list = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
            if (num_list.findIndex((e) => e == src.substr(0, 1)) == num_list.findIndex((e) => e == dst.substr(0, 1)) - 1) {
                return true
            }
        }
        return false
    }

    bottom_to_bottom = (src, src_idx, dst) => {
        //移動元の列からカードを削除
        for (let i = src_idx; i < this.card_array[src].length; i++) {
            $('#card_array' + src).children('img').eq(src_idx).remove()
        }
        const move_array = this.card_array[src].splice(src_idx)
        //移動先の列にカードを挿入
        for (let i = 0; i < move_array.length; i++) {
            this.card_array[dst].push(move_array[i])
            $('#card_array' + dst).append(`<img src="./cards/${move_array[i]}.gif">`)
        }
        //移動元の列のカードを表にする
        if (this.card_array[src].length > 0) {
            $('#card_array' + src).children('img').eq(-1).attr({ 'src': `./cards/${this.card_array[src].slice(-1)[0]}.gif` })
        }
    }

    deck_to_bottom = (dst) => {
        const move_card = this.open_cards.pop()
        console.log(this.open_cards);
        //移動元カード更新
        if (this.open_cards.length > 0) {
            $('#open_deck').children('img').attr({ 'src': `./cards/${this.open_cards.slice(-1)[0]}.gif` })
        } else {
            $('#open_deck').children('img').remove()
        }
        //移動先カード更新
        this.card_array[dst].push(move_card)
        console.log(move_card);
        $('#card_array' + dst).append(`<img src="./cards/${move_card}.gif">`)
    }

    collection_to_bottom = (src, dst) => {
        const move_card = this.suit_array[src].pop()
        if (this.suit_array[src].length > 0) {
            $('#suit_array' + src).children('img').attr({ 'src': `./cards/${this.suit_array[src].slice(-1)[0]}.gif` })
        } else {
            $('#suit_array' + src).children('img').remove()
        }
        this.card_array[dst].push(move_card)
        $('#card_array' + dst).append(`<img src="./cards/${move_card}.gif">`)
    }

    check_can_collect = (src, dst) => {
        if (src.substr(1, 1) == dst.substr(1, 1)) {
            const num_list = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
            if (num_list.findIndex((e) => e == src.substr(0, 1)) == num_list.findIndex((e) => e == dst.substr(0, 1)) + 1) {
                return true
            }
        }
        return false
    }

    bottom_to_collection = (src, dst) => {
        const move_card = this.card_array[src].pop()
        $('#card_array' + src).children('img').eq(-1).remove()
        //移動元の列のカードを表にする
        if (this.card_array[src].length > 0) {
            $('#card_array' + src).children('img').eq(-1).attr({ 'src': `./cards/${this.card_array[src].slice(-1)[0]}.gif` })
        }
        this.suit_array[dst].push(move_card)
        console.log(this.suit_array);
        console.log($('#suit_array' + dst).children('img').length);
        if ($('#suit_array' + dst).children('img').length > 0) {
            $('#suit_array' + dst).children('img').attr({ 'src': `./cards/${move_card}.gif` })
        } else {
            console.log(dst);
            $('#suit_array' + dst).append(`<img src="./cards/${move_card}.gif">`)
        }
    }

    deck_to_collection = (dst) => {
        const move_card = this.open_cards.pop()
        //移動元カード更新
        if (this.open_cards.length > 0) {
            $('#open_deck').children('img').attr({ 'src': `./cards/${this.open_cards.slice(-1)[0]}.gif` })
        } else {
            $('#open_deck').children('img').remove()
        }
        this.suit_array[dst].push(move_card)
        console.log(this.suit_array);
        console.log($('#suit_array' + dst).children('img').length);
        if ($('#suit_array' + dst).children('img').length > 0) {
            $('#suit_array' + dst).children('img').attr({ 'src': `./cards/${move_card}.gif` })
        } else {
            console.log(dst);
            $('#suit_array' + dst).append(`<img src="./cards/${move_card}.gif">`)
        }
    }

    check_success = () => {
        if (this.suit_array[0].length == 13 && this.suit_array[1].length == 13 && this.suit_array[2].length == 13 && this.suit_array[3].length == 13) {
            alert("完成しました！！")
        }
    }
}

const st = new State

let src = -1, dst = -1, src_idx, dst_idx, src_type

$('#bottom div').on('click', 'img', function () { //appendした要素でも発火させるには、親要素.onの形にする必要がある
    //移動元カード選択時の処理
    if (dst == -1) {
        src_type = 'bottom'
        //表向きのカードをクリックしたときの処理
        if ($(this).attr('src') != './cards/hidden.gif') {
            //選択したカードがどの列のカードか
            src = parseInt($(this).parent().attr('id').slice(-1))
            //選択したカードがその列の何番目のカードか
            src_idx = $(this).parent().children('img').index(this)
            // console.log(st.card_array[src][src_idx]);
            // 移動元カードにクラス追加
            $(this).addClass('src-select')
        };
    }
    //移動先カード選択後の処理
    else {
        if (src_type == 'bottom') {
            if (st.check_can_move(st.card_array[src][src_idx], st.card_array[dst][dst_idx])) {
                st.bottom_to_bottom(src, src_idx, dst)
            }
        } else if (src_type == 'deck') {
            if (st.check_can_move(st.open_cards[src_idx], st.card_array[dst][dst_idx])) {
                st.deck_to_bottom(dst)
            }
        } else {
            if (st.check_can_move(st.suit_array[src].slice(-1)[0], st.card_array[dst][dst_idx])) {
                st.collection_to_bottom(src, dst)
            }
        }
        // 変数、クラスをリセット
        src = -1, dst = -1
        $('.src-select').removeClass('src-select')
        $('.dst-select').removeClass('dst-select')
    }
})

$('#upper div').on('click', 'img', function () {
    if ($(this).parent().attr('id') != 'rest_deck') {
        //移動元カード選択時の処理
        if (dst == -1) {
            if (src == -1) {
                if ($(this).parent().attr('id') == 'open_deck') {
                    src_type = 'deck'
                    src = 'deck' //使わない
                    src_idx = st.open_cards.length - 1
                } else {
                    src_type = 'collection'
                    src = parseInt($(this).parent().attr('id').slice(-1))
                    src_idx = st.suit_array[src].length - 1
                }
                // 移動元カードにクラス追加
                $(this).addClass('src-select')
            } else {
                // 移動元カードリセット
                src = -1
                $(this).removeClass('src-select')
            }
        }
        //右上のエリアにカードを移動する際の処理
        else {
            if ($(this).parent().attr('id') != 'open_deck') {
                if (src_type == 'bottom') {
                    //移動元が一番上のカードかどうか判定
                    if (src_idx == st.card_array[src].length - 1) {
                        if (st.check_can_collect(st.card_array[src][src_idx], st.suit_array[dst].slice(-1)[0])) {
                            st.bottom_to_collection(src, dst)
                        }
                    }
                } else if (src_type == 'deck') {
                    if (st.check_can_collect(st.open_cards[src_idx], st.suit_array[dst].slice(-1)[0])) {
                        st.deck_to_collection(dst)
                    }
                }

            }
            //完成したか判定
            st.check_success()

            // 変数、クラスをリセット
            src = -1, dst = -1
            $('.src-select').removeClass('src-select')
            $('.dst-select').removeClass('dst-select')
        }
    }
})

//移動先カード選択時の処理
$('#play_area div div').on('hover', 'img', function () {
    //移動元が選択済みのときのみ発火
    if (src != -1) {
        if ($(this).parent().attr('id') != 'rest_deck' && $(this).parent().attr('id') != 'open_deck') {
            //表向きのカードに対してのみ発火
            if ($(this).attr('src') != './cards/hidden.gif') {
                dst = parseInt($(this).parent().attr('id').slice(-1))
                dst_idx = $(`#${$(this).parent().attr('id')}`).children('img').length - 1
                $(this).addClass('dst-select')
            }
        }
    };
})

$('#play_area div div').on('mouseleave', 'img', function () {
    //移動元が選択済みのときのみ発火
    if (src != -1) {
        dst = -1
        $(this).removeClass('dst-select')
    };
})

// Kのみ置ける空の列に対する処理
$('#bottom div.empty').on({
    'hover': function () {
        //移動元が選択済みのときのみ発火
        if (src != -1) {
            dst = parseInt($(this).parent().attr('id').slice(-1))
            $(this).addClass('dst-select')
        }
    },
    'mouseleave': function () {
        //移動元が選択済みのときのみ発火
        if (src != -1) {
            dst = -1
            $(this).removeClass('dst-select')
        }
    },
    'click': function () {
        //移動元が選択済みのときのみ発火
        if (src != -1) {
            if (src_type == 'bottom') {
                if (st.card_array[src][src_idx].substr(0, 1) == 'K') {
                    st.bottom_to_bottom(src, src_idx, dst)
                }
            } else if (src_type == 'deck') {
                if (st.open_cards.slice(-1)[0].substr(0, 1) == 'K') {
                    st.deck_to_bottom(dst)
                }
            } else {
                if (st.suit_array[src].slice(-1)[0].substr(0, 1) == 'K') {
                    st.collection_to_bottom(src, dst)
                }
            }
        }
        // 変数、クラスをリセット
        src = -1, dst = -1
        $('.src-select').removeClass('src-select')
        $('.dst-select').removeClass('dst-select')
    }
})

// Aのみ置ける空の列に対する処理
$('#upper div.empty').on({
    'hover': function () {
        //移動元が選択済みのときのみ発火
        if (src != -1) {
            if ($(this).parent().attr('id') != 'rest_deck' && $(this).parent().attr('id') != 'open_deck') {
                dst = parseInt($(this).parent().attr('id').slice(-1))
                $(this).addClass('dst-select')
            }
        }
    },
    'mouseleave': function () {
        //移動元が選択済みのときのみ発火
        if (src != -1) {
            dst = -1
            $(this).removeClass('dst-select')
        }
    },
    'click': function () {
        //移動元が選択済みのときのみ発火
        if (src != -1) {
            if ($(this).parent().attr('id') != 'rest_deck' && $(this).parent().attr('id') != 'open_deck') {
                if (src_type == 'bottom') {
                    if (src_idx == st.card_array[src].length - 1) {
                        if (st.card_array[src][src_idx].substr(0, 1) == 'A') {
                            st.bottom_to_collection(src, dst)
                        }
                    }
                } else if (src_type == 'deck') {
                    if (st.open_cards[src_idx].substr(0, 1) == 'A') {
                        st.deck_to_collection(dst)
                    }
                }
            }
        }
        // 変数、クラスをリセット
        src = -1, dst = -1
        $('.src-select').removeClass('src-select')
        $('.dst-select').removeClass('dst-select')
    }
})

//デッキをめくる処理
$('#rest_deck').on('click', 'img', function () {
    st.open_cards.push(st.deck.shift()) //popは末尾を削除（shiftは先頭を削除）、unshiftは先頭に追加（pushは末尾に追加）
    $('#open_deck img').remove()
    $('#open_deck').append(`<img src="./cards/${st.open_cards.slice(-1)[0]}.gif">`)
    //クリックしたことでデッキ枚数が0になったとき
    if (st.deck.length == 0) $(this).remove()

    // 変数、クラスをリセット
    src = -1, dst = -1
    $('.src-select').removeClass('src-select')
})

$('#rest_deck').on('click', '.empty', function () {
    st.deck = st.open_cards
    st.open_cards = []
    if ($('#open_deck').children('img').length > 0) {
        $('#open_deck img').remove()
        $('#rest_deck').append('<img src="./cards/hidden.gif">')
    }
})