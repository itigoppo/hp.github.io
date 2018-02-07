var is_hp_active_only = false;
var is_unit_active_only = false;
var select_units = [];
$(function () {
    load_hp_member();
    load_unit_member();

    $('#search-hp').find('input[name="status"]:radio').change(function () {
        if ($(this).val() === 'active') {
            is_hp_active_only = true;
        } else {
            is_hp_active_only = false;
        }
        load_hp_member();
    });

    var search_unit = $('#search-unit');
    search_unit.find('input[name="status"]:radio').change(function () {
        if ($(this).val() === 'active') {
            is_unit_active_only = true;
        } else {
            is_unit_active_only = false;
        }
        load_unit_member();
    });

    search_unit.find('input[name="units[]"]').change(function () {
        select_units = [];
        search_unit.find('input[name="units[]"]:checked').each(function () {
            select_units.push($(this).val());
        });
        load_unit_member();
    });

    var table_hp = $("#list-hp");
    var table_unit = $("#list-unit");

    // ソート順
    table_hp.stupidtable();
    table_hp.bind('aftertablesort', function (event, data) {
        // data.column - the index of the column sorted after a click
        // data.direction - the sorting direction (either asc or desc)
        // data.$th - the th element (in jQuery wrapper)
        // $(this) - this table object
    });

    table_unit.stupidtable();
    table_unit.bind('aftertablesort', function (event, data) {
        // data.column - the index of the column sorted after a click
        // data.direction - the sorting direction (either asc or desc)
        // data.$th - the th element (in jQuery wrapper)
        // $(this) - this table object
    });
});

/**
 * 対象のユニットカテゴリからユニットグループを取得
 *
 * @param categories
 * @returns {Array}
 */
function get_unit_group(categories) {
    var units = [];
    $.ajaxSetup({async: false}); // 同期通信(json取ってくるまで待つ)
    $.getJSON("./js/unit.json", function (data) {
        $(data.unit).each(function () {

            if (categories.indexOf(this.name) >= 0) {
                if (typeof this.group === "undefined") {
                    units.push(this.name);
                } else {
                    Array.prototype.push.apply(units, this.group);
                }
            }

        })
    });
    $.ajaxSetup({async: true}); // 非同期に戻す

    return units;
}

/**
 * メンバー読み込み(全体)
 */
function load_hp_member() {
    var list = $("#list-hp");
    list.find("tbody tr").remove();

    var today = new Date();

    var column_number_name = 0;
    var column_number_birth_date = 1;
    var column_number_age = 2;
    var column_number_join_date = 3;
    var column_number_join_age = 4;
    var column_number_graduate_date = 5;
    var column_number_graduate_age = 6;
    var column_number_enrollment = 7;
    var column_number_enrollment_day = 8;

    $.getJSON("./js/member.json", function (data) {
        var count = 0;
        $(data.member).each(function () {
            if (typeof this.graduate_date !== "undefined" && is_hp_active_only === true) {
                return true;
            }

            // 表示用配列作成
            var hp_member = new Array(9);
            hp_member[column_number_name] = this.member_name;
            hp_member[column_number_birth_date] = this.birth_date;
            hp_member[column_number_join_date] = this.join_date;
            if (typeof this.graduate_date !== "undefined") {
                hp_member[column_number_graduate_date] = this.graduate_date;
            }

            // 日付をDate型に
            var birth_date = new Date(this.birth_date);

            var join_date = today;
            if (this.join_date.indexOf('dd') !== -1) {
                var join_day_unknown = this.join_date.split('/');
                join_date = new Date(Number(join_day_unknown[0]), Number(join_day_unknown[1]) + 1, 0);
            } else {
                join_date = new Date(this.join_date);
            }

            var graduate_date = today;
            if (typeof this.graduate_date !== "undefined") {
                if (this.graduate_date.indexOf('dd') !== -1) {
                    var graduate_day_unknown = this.graduate_date.split('/');
                    graduate_date = new Date(Number(graduate_day_unknown[0]), Number(graduate_day_unknown[1]) + 1, 0);
                } else {
                    graduate_date = new Date(this.graduate_date);
                }
            }

            // 年齢
            var age = calAge(birth_date, today);
            hp_member[column_number_age] = age;

            // H!P加入時年齢
            var join_age = calAge(birth_date, join_date);
            hp_member[column_number_join_age] = join_age;

            // H!P卒業時年齢
            if (typeof this.graduate_date !== "undefined") {
                var graduate_age = calAge(birth_date, graduate_date);
                hp_member[column_number_graduate_age] = graduate_age;
            }

            // H!P在籍期間
            var enrollment_year = diffYear(join_date, graduate_date);
            var enrollment_diff_month = diffMonth(join_date, graduate_date);
            var enrollment_month = enrollment_diff_month % 12;
            var enrollment_day = diffDay(addMonth(join_date, enrollment_diff_month), graduate_date);
            hp_member[column_number_enrollment] = enrollment_year + '年' + enrollment_month + 'ヶ月' + enrollment_day + '日';

            // H!P在籍日数
            hp_member[column_number_enrollment_day] = diffDay(join_date, graduate_date);

            // 表示
            list.append("<tr id=\"member-hp" + count + "\"></tr>");
            if (typeof this.graduate_date === "undefined" && is_hp_active_only === false) {
                list.find("#member-hp" + count).addClass('bg-success');
            }

            for (var cnt1 = 0; cnt1 < hp_member.length; cnt1++) {
                if (typeof hp_member[cnt1] !== "undefined") {
                    list.find("#member-hp" + count).append("<td>" + hp_member[cnt1] + "</td>");
                } else {
                    list.find("#member-hp" + count).append("<td></td>");
                }
            }
            count++;
        })
    });
}

/**
 * メンバー読み込み(ユニット)
 */
function load_unit_member() {
    var list = $("#list-unit");
    list.find("tbody tr").remove();

    var today = new Date();

    var select_unit_groups = get_unit_group(select_units);

    var column_number_name = 0;
    var column_number_unit = 1;
    var column_number_unit_join_date = 2;
    var column_number_unit_join_age = 3;
    var column_number_unit_graduate_date = 4;
    var column_number_unit_graduate_age = 5;
    var column_number_unit_enrollment = 6;
    var column_number_unit_enrollment_day = 7;

    $.getJSON("./js/member.json", function (data) {
        var count = 0;
        $(data.member).each(function () {
            // H!Pを卒業していたらユニットが継続中でも卒業
            if (typeof this.unit_graduate_date === "undefined" && typeof this.graduate_date !== "undefined") {
                this.unit_graduate_date = this.graduate_date;
            }
            if (typeof this.concurrent_graduate_date === "undefined" && typeof this.graduate_date !== "undefined") {
                this.concurrent_graduate_date = this.graduate_date;
            }
            if (typeof this.unit_graduate_date !== "undefined" && typeof this.concurrent_graduate_date !== "undefined" && is_unit_active_only === true) {
                return true;
            }
            // 検索
            var unit_skip = false;
            var concurrent_skip = false;
            // 現役のみ
            if (typeof this.unit_graduate_date !== "undefined" && is_unit_active_only === true) {
                unit_skip = true;
            }
            if (typeof this.concurrent_graduate_date !== "undefined" && is_unit_active_only === true) {
                concurrent_skip = true;
            }
            // ユニット絞込
            if (select_unit_groups.length !== 0) {
                if (typeof this.unit === "object") {
                    var search_unit = false;
                    for (var cnt1 = 0; cnt1 < this.unit.length; cnt1++) {
                        if (select_unit_groups.indexOf(this.unit[cnt1]) >= 0) {
                            search_unit = true;
                        }
                    }
                    if (search_unit === false) {
                        unit_skip = true;
                    }
                } else if (typeof this.unit !== "undefined") {
                    if (select_unit_groups.indexOf(this.unit) === -1) {
                        unit_skip = true;
                    }
                }

                if (typeof this.concurrent_unit === "object") {
                    var search_concurrent = false;
                    for (var cnt2 = 0; cnt2 < this.concurrent_unit.length; cnt2++) {
                        if (select_unit_groups.indexOf(this.concurrent_unit[cnt2]) >= 0) {
                            search_concurrent = true;
                        }
                    }
                    if (search_concurrent === false) {
                        concurrent_skip = true;
                    }
                } else if (typeof this.concurrent_unit !== "undefined") {
                    if (select_unit_groups.indexOf(this.concurrent_unit) === -1) {
                        concurrent_skip = true;
                    }
                }
            }

            // 表示用配列作成
            var unit_member = new Array(8);
            unit_member[column_number_name] = this.member_name;
            if (typeof this.unit === "object") {
                unit_member[column_number_unit] = this.unit.join('<br/>');
            } else {
                unit_member[column_number_unit] = this.unit;
            }
            unit_member[column_number_unit_join_date] = this.unit_join_date;
            unit_member[column_number_unit_graduate_date] = this.unit_graduate_date;

            var concurrent_unit_member = new Array(8);
            concurrent_unit_member[column_number_name] = this.member_name;
            if (typeof this.concurrent_unit === "object") {
                concurrent_unit_member[column_number_unit] = this.concurrent_unit.join('<br/>');
            } else {
                concurrent_unit_member[column_number_unit] = this.concurrent_unit;
            }
            concurrent_unit_member[column_number_unit_join_date] = this.concurrent_join_date;
            concurrent_unit_member[column_number_unit_graduate_date] = this.concurrent_graduate_date;

            // 日付をDate型に
            var birth_date = new Date(this.birth_date);

            var unit_join_date = today;
            if (typeof this.unit_join_date !== "undefined") {
                if (this.unit_join_date.indexOf('dd') !== -1) {
                    var unit_join_day_unknown = this.unit_join_date.split('/');
                    unit_join_date = new Date(Number(unit_join_day_unknown[0]), Number(unit_join_day_unknown[1]) + 1, 0);
                } else {
                    unit_join_date = new Date(this.unit_join_date);
                }
            }

            var unit_graduate_date = today;
            if (typeof this.unit_graduate_date !== "undefined") {
                if (this.unit_graduate_date.indexOf('dd') !== -1) {
                    var unit_graduate_day_unknown = this.unit_graduate_date.split('/');
                    unit_graduate_date = new Date(Number(unit_graduate_day_unknown[0]), Number(unit_graduate_day_unknown[1]) + 1, 0);
                } else {
                    unit_graduate_date = new Date(this.unit_graduate_date);
                }
            }

            var concurrent_join_date = today;
            if (typeof this.concurrent_join_date !== "undefined") {
                if (this.concurrent_join_date.indexOf('dd') !== -1) {
                    var concurrent_join_day_unknown = this.concurrent_join_date.split('/');
                    concurrent_join_date = new Date(Number(concurrent_join_day_unknown[0]), Number(concurrent_join_day_unknown[1]) + 1, 0);
                } else {
                    concurrent_join_date = new Date(this.concurrent_join_date);
                }
            }

            var concurrent_graduate_date = today;
            if (typeof this.concurrent_graduate_date !== "undefined") {
                if (this.concurrent_graduate_date.indexOf('dd') !== -1) {
                    var concurrent_graduate_day_unknown = this.concurrent_graduate_date.split('/');
                    concurrent_graduate_date = new Date(Number(concurrent_graduate_day_unknown[0]), Number(concurrent_graduate_day_unknown[1]) + 1, 0);
                } else {
                    concurrent_graduate_date = new Date(this.concurrent_graduate_date);
                }
            }

            // ユニット加入時年齢
            if (typeof this.unit_join_date !== "undefined") {
                var unit_join_age = calAge(birth_date, unit_join_date);
                unit_member[column_number_unit_join_age] = unit_join_age;
            }

            // ユニット卒業時年齢
            if (typeof this.unit_graduate_date !== "undefined") {
                var unit_graduate_age = calAge(birth_date, unit_graduate_date);
                unit_member[column_number_unit_graduate_age] = unit_graduate_age;
            }

            if (typeof this.unit !== "undefined") {
                // ユニット在籍期間
                var unit_enrollment_year = diffYear(unit_join_date, unit_graduate_date);
                var unit_enrollment_diff_month = diffMonth(unit_join_date, unit_graduate_date);
                var unit_enrollment_month = unit_enrollment_diff_month % 12;
                var unit_enrollment_day = diffDay(addMonth(unit_join_date, unit_enrollment_diff_month), unit_graduate_date);
                unit_member[column_number_unit_enrollment] = unit_enrollment_year + '年' + unit_enrollment_month + 'ヶ月' + unit_enrollment_day + '日';

                // ユニット在籍日数
                unit_member[column_number_unit_enrollment_day] = diffDay(unit_join_date, unit_graduate_date);
            }

            // 兼任先加入時年齢
            if (typeof this.concurrent_join_date !== "undefined") {
                var concurrent_join_age = calAge(birth_date, concurrent_join_date);
                concurrent_unit_member[column_number_unit_join_age] = concurrent_join_age;
            }

            // 兼任先卒業時年齢
            if (typeof this.concurrent_graduate_date !== "undefined") {
                var concurrent_graduate_age = calAge(birth_date, concurrent_graduate_date);
                concurrent_unit_member[column_number_unit_graduate_age] = concurrent_graduate_age;
            }

            if (typeof this.concurrent_unit !== "undefined") {
                // 兼任先在籍期間
                var concurrent_enrollment_year = diffYear(concurrent_join_date, concurrent_graduate_date);
                var concurrent_enrollment_diff_month = diffMonth(concurrent_join_date, concurrent_graduate_date);
                var concurrent_enrollment_month = concurrent_enrollment_diff_month % 12;
                var concurrent_enrollment_day = diffDay(addMonth(concurrent_join_date, concurrent_enrollment_diff_month), concurrent_graduate_date);
                concurrent_unit_member[column_number_unit_enrollment] = concurrent_enrollment_year + '年' + concurrent_enrollment_month + 'ヶ月' + concurrent_enrollment_day + '日';

                // 兼任先在籍日数
                concurrent_unit_member[column_number_unit_enrollment_day] = diffDay(concurrent_join_date, concurrent_graduate_date);
            }

            // 表示
            if (typeof this.unit !== "undefined" && unit_skip === false) {
                list.append("<tr id=\"member-unit" + count + "\"></tr>");
                if (typeof this.unit_graduate_date === "undefined" && is_unit_active_only === false) {
                    list.find("#member-unit" + count).addClass('bg-success');
                }

                for (var cnt3 = 0; cnt3 < unit_member.length; cnt3++) {
                    if (typeof unit_member[cnt3] !== "undefined") {
                        list.find("#member-unit" + count).append("<td>" + unit_member[cnt3] + "</td>");
                    } else {
                        list.find("#member-unit" + count).append("<td></td>");
                    }
                }
            }
            if (typeof this.concurrent_unit !== "undefined" && concurrent_skip === false) {
                list.append("<tr id=\"member-concurrent" + count + "\"></tr>");

                if (typeof this.concurrent_graduate_date === "undefined" && is_unit_active_only === false) {
                    list.find("#member-concurrent" + count).addClass('bg-success');
                }

                for (var cnt4 = 0; cnt4 < concurrent_unit_member.length; cnt4++) {
                    if (typeof concurrent_unit_member[cnt4] !== "undefined") {
                        list.find("#member-concurrent" + count).append("<td>" + concurrent_unit_member[cnt4] + "</td>");
                    } else {
                        list.find("#member-concurrent" + count).append("<td></td>");
                    }
                }
            }

            count++;
        })
    });
}

/**
 * 0埋め
 *
 * @param num
 * @param length
 * @returns {string}
 */
function zeroPadding(num, length) {
    return ('000' + num).slice(-length);
}

/**
 * 年齢計算
 *
 * @param birth_date
 * @param base_date
 * @returns {number}
 */
function calAge(birth_date, base_date) {
    var birth_year = birth_date.getFullYear();
    var birth_month = birth_date.getMonth() + 1;
    var birth_day = birth_date.getDate();
    var birth_string = zeroPadding(birth_year, 4) + zeroPadding(birth_month, 2) + zeroPadding(birth_day, 2);

    var base_year = base_date.getFullYear();
    var base_month = base_date.getMonth() + 1;
    var base_day = base_date.getDate();
    var base_string = zeroPadding(base_year, 4) + zeroPadding(base_month, 2) + zeroPadding(base_day, 2);

    return Math.floor((Number(base_string) - Number(birth_string)) / 10000)
}

/**
 * 経過日数
 *
 * @param start_date
 * @param end_date
 * @returns {number}
 */
function diffDay(start_date, end_date) {
    var diff = end_date.getTime() - start_date.getTime();
    return Math.floor(diff / 1000 / 60 / 60 / 24);
}

/**
 * 経過月数
 *
 * @param start_date
 * @param end_date
 * @returns {number}
 */
function diffMonth(start_date, end_date) {
    var start_year = start_date.getFullYear();
    var start_month = start_date.getMonth();

    var end_year = end_date.getFullYear();
    var end_month = end_date.getMonth();

    var result = (end_year * 12 + end_month) - (start_year * 12 + start_month);
    var result_month = addMonth(start_date, result);

    if (diffDay(result_month, end_date) < 0) --result;

    return result;
}

/**
 * 経過年数
 *
 * @param start_date
 * @param end_date
 * @returns {number}
 */
function diffYear(start_date, end_date) {
    return parseInt(diffMonth(start_date, end_date) / 12);
}

/**
 * 日数を加算
 *
 * @param base_date
 * @param add_day
 * @returns {Date}
 */
function addDay(base_date, add_day) {
    var base_year = base_date.getFullYear();
    var base_month = base_date.getMonth();
    var base_day = base_date.getDate();
    var result = new Date(base_year, base_month, base_day);

    result.setDate(add_day);

    return result;
}

/**
 * 月数を加算
 *
 * @param base_date
 * @param add_month
 * @returns {Date}
 */
function addMonth(base_date, add_month) {
    var base_year = base_date.getFullYear();
    var base_month = base_date.getMonth();
    var base_day = base_date.getDate();
    var result = new Date(base_year, base_month, base_day);

    var next_month = (new Date(base_year, base_month + 1, 0)).getDate();
    var result_month = base_month + add_month;
    var result_year = base_year + parseInt(result_month / 12);
    result_month %= 12;

    var result_next_month = (new Date(result_year, result_month + 1, 0)).getDate();

    result.setFullYear(result_year, result_month, (base_day == next_month || base_day > result_next_month ? result_next_month : base_day));

    return result;
}