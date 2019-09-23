function seq(from, to, by = 1) {
  let res = [];
  for(let i = from; i <= to; i += by) {
    res.push(i);
  }
  return res;
}

function wilkinson(dmin, dmax, m, Q = [ 1, 5, 2, 2.5, 3, 4, 1.5, 7, 6, 8, 9 ], mincoverage = 0.8) {
  let best = null;
  let mrange = [];
  let mrangeA = Math.max(Math.floor(m / 2), 2);
  let mrangeB = Math.ceil(6 * m);
  for(let i = mrangeA; i <= mrangeB; i++) {
    let result = wilkinson_nice_scale(dmin, dmax, i, Q, mincoverage, mrange, m);
    if(result !== null && (best === null || result.score > best.score)) {
      best = result;
    }
  }
  return seq(best.lmin, best.lmax, best.lstep);
}

function wilkinson_nice_scale(min, max, k, Q = [ 1, 5, 2, 2.5, 3, 4, 1.5, 7, 6, 8, 9 ], mincoverage = 0.8, mrange = [], m = k) {
  Q.unshift(10);
  let range = max - min;
  let intervals = k - 1;
  let granularity = 1 - Math.abs(k - m) / m;

  let delta = range / intervals;
  let base = Math.floor(Math.log10(delta));
  let dbase = Math.pow(10, base);

  let best = null;
  for(let i = 1; i <= Q.length; i++) {
    let tdelta = Q[i] * dbase;
    let tmin = Math.floor(min / tdelta) * tdelta;
    let tmax = tmin + intervals * tdelta;

    if(tmin <= min && tmax >= max) {
      let roundness = 1 - ((i - 1) - (tmin <= 0 && tmax >= 0 ? 1 : 0)) / Q.length;
      let coverage = (max - min) / (tmax - tmin);
      if(coverage > mincoverage) {
        let tnice = granularity + roundness + coverage;

        if(best === null || tnice > best.score) {
          best = {
            lmin: tmin,
            lmax: tmax,
            lstep: tdelta,
            score: tnice,
          };
        }
      }
    }
  }
  return best;
}

export default wilkinson;
