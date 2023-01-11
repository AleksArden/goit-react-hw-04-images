import axios from 'axios';

const imagesApi = axios.create({
    baseURL: 'https://pixabay.com/',
});

export const fetchImages = async (search, page) => {
    const { data } = await imagesApi.get('api/', {
        params: {
            q: search,
            page,
            key: '31274725-b360bae12e89bdbfdfe087168',
            image_type: 'photo',
            orientation: 'horizontal',
            per_page: 12,
        },
    });

    return data;
};
