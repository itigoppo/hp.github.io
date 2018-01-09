$(document).ready(function () {
    var today = new Date();
    var today_year = today.getFullYear();
    var today_month = today.getMonth() + 1;
    var today_day = today.getDate();
    var today_string = zeroPadding(today_year, 4) + zeroPadding(today_month, 2) + zeroPadding(today_day, 2);

    $('#member tbody tr').each(function (index, element) {
        var birth_date = new Date($(element).children('td:nth-child(2)').text());
        var birth_year = birth_date.getFullYear();
        var birth_month = birth_date.getMonth() + 1;
        var birth_day = birth_date.getDate();
        var birth_string = zeroPadding(birth_year, 4) + zeroPadding(birth_month, 2) + zeroPadding(birth_day, 2);

        var join_date = new Date($(element).children('td:nth-child(4)').text());
        var join_year = join_date.getFullYear();
        var join_month = join_date.getMonth() + 1;
        var join_day = join_date.getDate();
        var join_string = zeroPadding(join_year, 4) + zeroPadding(join_month, 2) + zeroPadding(join_day, 2);

        var input_graduate = $(element).children('td:nth-child(6)').text();
        var graduate_date = today;
        if (input_graduate) {
            graduate_date = new Date(input_graduate);
        }
        var graduate_year = graduate_date.getFullYear();
        var graduate_month = graduate_date.getMonth() + 1;
        var graduate_day = graduate_date.getDate();
        var graduate_string = zeroPadding(graduate_year, 4) + zeroPadding(graduate_month, 2) + zeroPadding(graduate_day, 2);


        var input_concurrent_join = $(element).children('td:nth-child(10)').text();
        var concurrent_join_date = today;
        if (input_concurrent_join) {
            concurrent_join_date = new Date(input_concurrent_join);
        }
        var concurrent_join_year = concurrent_join_date.getFullYear();
        var concurrent_join_month = concurrent_join_date.getMonth() + 1;
        var concurrent_join_day = concurrent_join_date.getDate();
        var concurrent_join_string = zeroPadding(concurrent_join_year, 4) + zeroPadding(concurrent_join_month, 2) + zeroPadding(concurrent_join_day, 2);

        var input_concurrent_graduate = $(element).children('td:nth-child(12)').text();
        var concurrent_graduate_date = today;
        if (input_concurrent_graduate) {
            concurrent_graduate_date = new Date(input_concurrent_graduate);
        }
        var concurrent_graduate_year = concurrent_graduate_date.getFullYear();
        var concurrent_graduate_month = concurrent_graduate_date.getMonth() + 1;
        var concurrent_graduate_day = concurrent_graduate_date.getDate();
        var concurrent_graduate_string = zeroPadding(concurrent_graduate_year, 4) + zeroPadding(concurrent_graduate_month, 2) + zeroPadding(concurrent_graduate_day, 2);

        // 年齢
        var age = Math.floor((Number(today_string) - Number(birth_string)) / 10000);
        $(element).children('td:nth-child(3)').text(age);

        // 加入時年齢
        var join_age = Math.floor((Number(join_string) - Number(birth_string)) / 10000);
        $(element).children('td:nth-child(5)').text(join_age);

        // 卒業時年齢
        if (input_graduate) {
            var graduate_age = Math.floor((Number(graduate_string) - Number(birth_string)) / 10000);
            $(element).children('td:nth-child(7)').text(graduate_age);
        } else {
            $(element).addClass('bg-success');
        }

        // 在籍期間
        var graduate_diff = graduate_date.getTime() - join_date.getTime();
        var enrollment_day = Math.floor(graduate_diff / 1000 / 60 / 60 / 24);
        var enrollment_year = Math.floor(enrollment_day / 1000 / 60 / 60 / 24);


        // var birth_diff_day = Math.floor(birth_diff / 1000 / 60 / 60 / 24);
        // var birth_diff_year = birth_diff / 1000 * 60 * 60 * 24 * 365;

        $(element).children('td:nth-child(9)').text(enrollment_day);



        // 兼任先加入時年齢
        if (input_concurrent_join) {
            var concurrent_join_age = Math.floor((Number(concurrent_join_string) - Number(birth_string)) / 10000);
            $(element).children('td:nth-child(11)').text(concurrent_join_age);
        }

        // 兼任先卒業時年齢
        if (input_concurrent_graduate) {
            var concurrent_graduate_age = Math.floor((Number(concurrent_graduate_string) - Number(birth_string)) / 10000);
            $(element).children('td:nth-child(13)').text(concurrent_graduate_age);
        }
    });
});

function zeroPadding(num, length) {
    return ('000' + num).slice(-length);
}