const State = class {
    constructor() {
        this.make_deck()
        this.set_cards()
    }

    make_deck = () => {
        this.deck = []
        const num_list = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
        const suit_list = ['♠', '♥', '♦', '♣']
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

        this.card_array.push([])
        this.deck = this.random_select(this.deck, this.deck.length)

        //各列にカードをセット
        for (let i = 0; i < 7; i++) {
            $(`#card_array${i + 1}`).html(this.card_array[i].slice(0)[0])
        }
    }

    //カードを移動可能か判定
    check_cards = (drag, drop) => {
        let can_move = false
        if ((drag.substr(1, 1) == '♠' || drag.substr(1, 1) == '♣') && (drop.substr(1, 1) == '♥' || drop.substr(1, 1) == '♦') ||
            (drag.substr(1, 1) == '♥' || drag.substr(1, 1) == '♦') && (drop.substr(1, 1) == '♠' || drop.substr(1, 1) == '♣')) {
            const num_list = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
            if (num_list.findIndex((e) => e == drag.substr(0, 1)) == num_list.findIndex((e) => e == drop.substr(0, 1)) - 1) {
                can_move = true
            }
        }
        return can_move
    }

    //下のカード列に動かしたときの処理
    move_card = (drag, drop) => {
        //何も置かれていない列にはKのみ置くことが可能
        if (drop.text() == "") {
            if (drag.text().substr(0, 1) == "K") {
                let id = 0

                //移動先のカードを更新
                id = parseInt(drop.attr('id').slice(-1)) - 1
                this.card_array[id].unshift(drag.text())
                drop.text(drag.text())
                //移動元のカードを更新
                id = parseInt(drag.attr('id').slice(-1)) - 1
                this.card_array[id].shift()
                if (this.card_array[id].length == 0) {
                    drag.text("")
                } else {
                    drag.text(this.card_array[id][0])
                }
            }
        } else if (this.check_cards(drag.text(), drop.text())) {
            let id = 0

            //移動先のカードを更新
            id = parseInt(drop.attr('id').slice(-1)) - 1
            this.card_array[id].unshift(drag.text())
            drop.text(drag.text())
            //移動元のカードを更新
            id = parseInt(drag.attr('id').slice(-1)) - 1
            this.card_array[id].shift()
            if (this.card_array[id].length == 0) {
                drag.text("")
            } else {
                drag.text(this.card_array[id][0])
            }
        }
    }

    //上のスペースに動かしたときの処理
    collect_card = (drag, drop) => {
        if (drop.text() == "") {
            //何も置かれていない場合Aのみ置くことが可能
            if (drag.text().substr(0, 1) == "A") {
                //移動先のカードを更新
                drop.text(drag.text())
                //移動元のカードを更新
                let id = parseInt(drag.attr('id').slice(-1)) - 1
                this.card_array[id].shift()
                if (this.card_array[id].length == 0) {
                    drag.text("")
                } else {
                    drag.text(this.card_array[id][0])
                }
            }
        } else {
            if (drag.text().substr(1, 1) == drop.text().substr(1, 1)) {
                const num_list = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
                if (num_list.findIndex((e) => e == drag.text().substr(0, 1)) == num_list.findIndex((e) => e == drop.text().substr(0, 1)) + 1) {
                    //移動先のカードを更新
                    drop.text(drag.text())
                    //移動元のカードを更新
                    let id = parseInt(drag.attr('id').slice(-1)) - 1
                    this.card_array[id].shift()
                    if (this.card_array[id].length == 0) {
                        drag.text("")
                    } else {
                        drag.text(this.card_array[id][0])
                    }
                }
            }
        }
    }
}

const st = new State

// const change_color = () => {
//     $(".card:contains('♥')").each(function () {
//         const txt = $(this).text();
//         $(this).html(
//             txt.replace(/♥/g, '<span style="color:red">♥</span>')
//         );
//     });
//     $(".card:contains('♦')").each(function () {
//         const txt = $(this).text();
//         $(this).html(
//             txt.replace(/♦/g, '<span style="color:red">♦</span>')
//         );
//     });
// }

// const reset_color = () => {
//     $(".card:contains('♥')").each(function () {
//         const txt = $(this).text();
//         $(this).html(
//             txt.replace('<span style="color:red">♥</span>', /♥/g)
//         );
//     });
//     $(".card:contains('♦')").each(function () {
//         const txt = $(this).text();
//         $(this).html(
//             txt.replace('<span style="color:red">♦</span>', /♦/g)
//         );
//     });
// }

// change_color()
// $(".card").sortable({
//     revert: true
// });

$(".card").draggable({
    // connectToSortable: ".card",
    helper: "clone",
    revert: "invalid"
    // revert: true
});

$(".card").droppable({
    //ドロップOKの要素を指定
    accept: ".card",
    //ドロップ時の動作
    drop: function (event, ui) {
        // reset_color()
        // ドロップされたDraggable要素を追加
        const drag = ui.draggable.find('span')
        const drop = $(this).find('span')
        if (drop.attr('id').substr(0, 10) == 'card_array') {
            st.move_card(drag, drop)
        }
        if (drop.attr('id').substr(0, 10) == 'suit_array') {
            st.collect_card(drag, drop)
        }
        // console.log(drag);
        // console.log(drop);
        // change_color()

        //終了判定
        if ($('#suit_array1').text().substr(0, 1) == 'K' &&
            $('#suit_array2').text().substr(0, 1) == 'K' &&
            $('#suit_array3').text().substr(0, 1) == 'K' &&
            $('#suit_array4').text().substr(0, 1) == 'K') {
            alert('完成しました！')
        }
    }
});

$('#rest_cards').on('click', function () {
    if (st.deck.length != 0) {
        st.card_array[7].unshift(st.deck.pop())
        $('#card_array8').text(st.card_array[7][0])
        //クリックしたことでデッキ枚数が0になったとき
        if (st.deck.length == 0) { $(this).text('◎') }
    } else {
        //クリックした時点でデッキ枚数が0のとき
        $(this).text('')
        st.deck = st.card_array[7]
        st.card_array[7] = []
    }
})