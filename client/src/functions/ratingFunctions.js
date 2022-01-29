import React from "react";
import StarRatings from "react-star-ratings";

export const showAverage = (p) => {
  if (p && p.ratings) {
    let ratingsArray = p && p.ratings;
    let total = [];
    let length = ratingsArray.length;

    ratingsArray.map((r) => total.push(r.star));

    let totalReduced = total.reduce((p, n) => p + n, 0);

    let highest = length * 5;

    let result = (totalReduced * 5) / highest;

    let average = totalReduced / length;

    return (
      <div className="text-center pt-3 pb-3 d-flex justify-content-center align-items-end">
        <span>
          <StarRatings
            starDimension="25px"
            starSpacing="2px"
            starRatedColor="red"
            rating={result}
            editing={false}
          />
          {/* <span className="pl-2 pt-5 fs-6">({p.ratings.length})</span> */}
        </span>
        <div className="pl-2 fs-6">({p.ratings.length})</div>
      </div>
    );

    // for (let i = 0; i < length - 1; i++) {
    //   total.push(ratingsArray.star);
    // }
  }
};
