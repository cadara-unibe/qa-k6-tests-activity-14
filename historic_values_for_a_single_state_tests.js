import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const res = http.get('https://api.covidtracking.com/v1/states/ca/daily.json');
    check(res, {
        'is status 200': (r) => r.status === 200,
        'is data for CA present': (r) => r.json()[0].state === 'CA',
    });
}
