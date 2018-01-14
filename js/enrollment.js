$(document).ready(function () {
    var today = new Date();
    var today_year = today.getFullYear();
    var today_month = today.getMonth() + 1;
    var today_day = today.getDate();
    var today_string = zeroPadding(today_year, 4) + zeroPadding(today_month, 2) + zeroPadding(today_day, 2);

    var column_number_name = 1;
    var column_number_birth_date = 2;
    var column_number_age = 3;
    var column_number_join_date = 4;
    var column_number_join_age = 5;
    var column_number_graduate_date = 6;
    var column_number_graduate_age = 7;
    var column_number_enrollment = 8;
    var column_number_enrollment_day = 9;
    var column_number_unit = 10;
    var column_number_unit_join_date = 11;
    var column_number_unit_join_age = 12;
    var column_number_unit_graduate_date = 13;
    var column_number_unit_graduate_age = 14;
    var column_number_unit_enrollment = 15;
    var column_number_unit_enrollment_day = 16;
    var column_number_concurrent_unit = 17;
    var column_number_concurrent_join_date = 18;
    var column_number_concurrent_join_age = 19;
    var column_number_concurrent_graduate_date = 20;
    var column_number_concurrent_graduate_age = 21;
    var column_number_concurrent_enrollment = 22;
    var column_number_concurrent_enrollment_day = 23;

    $('#member tbody tr').each(function (index, element) {
        // テーブルのデータ取得
        var input_birth = $(element).children('td:nth-child(' + column_number_birth_date + ')').text();
        var input_join = $(element).children('td:nth-child(' + column_number_join_date + ')').text();
        var input_graduate = $(element).children('td:nth-child(' + column_number_graduate_date + ')').text();
        var input_unit = $(element).children('td:nth-child(' + column_number_unit + ')').text();
        var input_unit_join = $(element).children('td:nth-child(' + column_number_unit_join_date + ')').text();
        var input_unit_graduate = $(element).children('td:nth-child(' + column_number_unit_graduate_date + ')').text();
        var input_concurrent_join = $(element).children('td:nth-child(' + column_number_concurrent_join_date + ')').text();
        var input_concurrent_graduate = $(element).children('td:nth-child(' + column_number_concurrent_graduate_date + ')').text();


        var birth_date = new Date(input_birth);
        var birth_year = birth_date.getFullYear();
        var birth_month = birth_date.getMonth() + 1;
        var birth_day = birth_date.getDate();
        var birth_string = zeroPadding(birth_year, 4) + zeroPadding(birth_month, 2) + zeroPadding(birth_day, 2);

        var join_date = today;
        if (input_join.indexOf('dd') !== -1) {
            var join_day_unknown = input_join.split('/');
            join_date = new Date(Number(join_day_unknown[0]), Number(join_day_unknown[1]) + 1, 0);
        } else {
            join_date = new Date(input_join);
        }
        var join_year = join_date.getFullYear();
        var join_month = join_date.getMonth() + 1;
        var join_day = join_date.getDate();
        var join_string = zeroPadding(join_year, 4) + zeroPadding(join_month, 2) + zeroPadding(join_day, 2);

        var unit_join_date = today;
        if (input_unit_join.indexOf('dd') !== -1) {
            var unit_join_day_unknown = input_unit_join.split('/');
            unit_join_date = new Date(Number(unit_join_day_unknown[0]), Number(unit_join_day_unknown[1]) + 1, 0);
        } else if(input_unit_join) {
            unit_join_date = new Date(input_unit_join);
        }
        var unit_join_year = unit_join_date.getFullYear();
        var unit_join_month = unit_join_date.getMonth() + 1;
        var unit_join_day = unit_join_date.getDate();
        var unit_join_string = zeroPadding(unit_join_year, 4) + zeroPadding(unit_join_month, 2) + zeroPadding(unit_join_day, 2);

        var unit_graduate_date = today;
        if (input_unit_graduate.indexOf('dd') !== -1) {
            var unit_graduate_day_unknown = input_unit_graduate.split('/');
            unit_graduate_date = new Date(Number(unit_graduate_day_unknown[0]), Number(unit_graduate_day_unknown[1]) + 1, 0);
        } else if(input_unit_graduate) {
            unit_graduate_date = new Date(input_unit_graduate);
        }
        var unit_graduate_year = unit_graduate_date.getFullYear();
        var unit_graduate_month = unit_graduate_date.getMonth() + 1;
        var unit_graduate_day = unit_graduate_date.getDate();
        var unit_graduate_string = zeroPadding(unit_graduate_year, 4) + zeroPadding(unit_graduate_month, 2) + zeroPadding(unit_graduate_day, 2);

        var concurrent_join_date = today;
        if (input_concurrent_join.indexOf('dd') !== -1) {
            var concurrent_join_day_unknown = input_concurrent_join.split('/');
            concurrent_join_date = new Date(Number(concurrent_join_day_unknown[0]), Number(concurrent_join_day_unknown[1]) + 1, 0);
        } else if (input_concurrent_join) {
            concurrent_join_date = new Date(input_concurrent_join);
        }
        var concurrent_join_year = concurrent_join_date.getFullYear();
        var concurrent_join_month = concurrent_join_date.getMonth() + 1;
        var concurrent_join_day = concurrent_join_date.getDate();
        var concurrent_join_string = zeroPadding(concurrent_join_year, 4) + zeroPadding(concurrent_join_month, 2) + zeroPadding(concurrent_join_day, 2);

        var concurrent_graduate_date = today;
        if (input_concurrent_graduate.indexOf('dd') !== -1) {
            var concurrent_graduate_day_unknown = input_concurrent_graduate.split('/');
            concurrent_graduate_date = new Date(Number(concurrent_graduate_day_unknown[0]), Number(concurrent_graduate_day_unknown[1]) + 1, 0);
        } else if (input_concurrent_graduate) {
            concurrent_graduate_date = new Date(input_concurrent_graduate);
        }
        var concurrent_graduate_year = concurrent_graduate_date.getFullYear();
        var concurrent_graduate_month = concurrent_graduate_date.getMonth() + 1;
        var concurrent_graduate_day = concurrent_graduate_date.getDate();
        var concurrent_graduate_string = zeroPadding(concurrent_graduate_year, 4) + zeroPadding(concurrent_graduate_month, 2) + zeroPadding(concurrent_graduate_day, 2);

        var graduate_date = today;
        if (input_graduate.indexOf('dd') !== -1) {
            var graduate_day_unknown = input_graduate.split('/');
            graduate_date = new Date(Number(graduate_day_unknown[0]), Number(graduate_day_unknown[1]) + 1, 0);
        } else if(input_graduate) {
            graduate_date = new Date(input_graduate);
        }
        var graduate_year = graduate_date.getFullYear();
        var graduate_month = graduate_date.getMonth() + 1;
        var graduate_day = graduate_date.getDate();
        var graduate_string = zeroPadding(graduate_year, 4) + zeroPadding(graduate_month, 2) + zeroPadding(graduate_day, 2);

        // 年齢
        var age = Math.floor((Number(today_string) - Number(birth_string)) / 10000);
        $(element).children('td:nth-child(' + column_number_age +')').text(age);

        // 加入時年齢
        var join_age = Math.floor((Number(join_string) - Number(birth_string)) / 10000);
        $(element).children('td:nth-child(' + column_number_join_age + ')').text(join_age);

        // H!P卒業時年齢
        if (input_graduate) {
            var graduate_age = Math.floor((Number(graduate_string) - Number(birth_string)) / 10000);
            $(element).children('td:nth-child(' + column_number_graduate_age + ')').text(graduate_age);
        } else {
            $(element).addClass('bg-success');
            // $(element).hide();
        }

        // H!P在籍期間
        var graduate_diff = graduate_date.getTime() - join_date.getTime();
        var enrollment_day = Math.floor(graduate_diff / 1000 / 60 / 60 / 24);
        $(element).children('td:nth-child(' + column_number_enrollment_day + ')').text(enrollment_day);

        // ユニット加入時年齢
        if (input_unit_join) {
            var unit_join_age = Math.floor((Number(unit_join_string) - Number(birth_string)) / 10000);
            $(element).children('td:nth-child(' + column_number_unit_join_age + ')').text(unit_join_age);
        }

        // ユニット卒業時年齢
        if (input_unit_graduate) {
            var unit_graduate_age = Math.floor((Number(unit_graduate_string) - Number(birth_string)) / 10000);
            $(element).children('td:nth-child(' + column_number_unit_graduate_age + ')').text(unit_graduate_age);
        }

        // ユニット在籍期間
        var unit_graduate_diff = unit_graduate_date.getTime() - join_date.getTime();
        var unit_enrollment_day = Math.floor(unit_graduate_diff / 1000 / 60 / 60 / 24);
        var enrollment_year = Math.floor(unit_enrollment_day / 1000 / 60 / 60 / 24);

        if (input_unit !== 'ソロ') {
            $(element).children('td:nth-child(' + column_number_unit_enrollment_day + ')').text(unit_enrollment_day);
        }

        // 兼任先加入時年齢
        if (input_concurrent_join) {
            var concurrent_join_age = Math.floor((Number(concurrent_join_string) - Number(birth_string)) / 10000);
            $(element).children('td:nth-child(' + column_number_concurrent_join_age + ')').text(concurrent_join_age);
        }

        // 兼任先卒業時年齢
        if (input_concurrent_graduate) {
            var concurrent_graduate_age = Math.floor((Number(concurrent_graduate_string) - Number(birth_string)) / 10000);
            $(element).children('td:nth-child(' + column_number_concurrent_graduate_age + ')').text(concurrent_graduate_age);
        }

        // 兼任先在籍期間
        if (input_concurrent_join) {
            var concurrent_graduate_diff = concurrent_graduate_date.getTime() - concurrent_join_date.getTime();
            var concurrent_enrollment_day = Math.floor(concurrent_graduate_diff / 1000 / 60 / 60 / 24);
            $(element).children('td:nth-child(' + column_number_concurrent_enrollment_day + ')').text(concurrent_enrollment_day);
        }
    });
});

function zeroPadding(num, length) {
    return ('000' + num).slice(-length);
}