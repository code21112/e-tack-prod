import axios from "axios";

export const getSubcategories = async () =>
  await axios.get(`${process.env.REACT_APP_API}/subcategories`);

export const getSubcategoriesSortedAlpha = async () =>
  await axios.get(`${process.env.REACT_APP_API}/subcategories/a-z`);

export const getSubcategoriesByCategorySortedAlpha = async (categoryId) =>
  await axios.get(
    `${process.env.REACT_APP_API}/subcategories/category/${categoryId}`
  );

export const getSubcategory = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/subcategory/${slug}`);

export const removeSubcategory = async (slug, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/subcategory/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const updateSubcategory = async (slug, subcategory, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/subcategory/${slug}`,
    subcategory,
    {
      headers: { authtoken },
    }
  );

export const createSubcategory = async (subcategory, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/subcategory`, subcategory, {
    headers: { authtoken },
  });
