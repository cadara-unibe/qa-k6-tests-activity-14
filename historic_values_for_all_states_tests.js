import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const res = http.get('https://api.covidtracking.com/v1/states/daily.json');
    check(res, {
        'is status 200': (r) => r.status === 200,
        'is data present': (r) => r.json().length > 0,
    });
}
