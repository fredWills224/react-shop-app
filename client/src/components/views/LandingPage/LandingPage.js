import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon, Col, Card, Row } from 'antd';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import { continents, price } from './Sections/Datas';
import SearchFeature from './Sections/SearchFeature';

const { Meta } = Card;

function LandingPage() {
   
    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8);
    const [PostSize, setPostSize] = useState(0);
    const [SearchTerms, setSearchTerms] = useState('');

    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })

    useEffect(() => {

        const variables = {
            skip: Skip,
            limit: Limit
        }

        getProducts(variables);

    }, [])

    const getProducts = (variables)=>{

        axios.post('/api/product/getProducts', variables)
            .then(response =>{

                if(response.data.success){

                    if(variables.loadMore){
                        setProducts([...Products, ...response.data.products]);
                    }else{
                        setProducts(response.data.products);
                    }
                    setPostSize(response.data.postSize);
                    console.log(response.data.products);
                }else{
                    alert('failed to fetch product data');
                }

            })
        ;

    }

    const onLoadMore = ()=>{

        let skip = Skip + Limit;
        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getProducts(variables);
        setSkip(skip);

    }
   
    const renderCards = Products.map((product, index) =>{
        return(
            <Col lg={6} md={8} xs={24}>
            
                <Card
                    hoverable={true}
                    cover={ <a href={`/product/${product._id}`}><ImageSlider images={product.images}/></a> }
                >
                    <Meta title={product.title} description={`$${product.price}`} />
                </Card>

            </Col>
        )
    });

    const showFilteredResults = (filters)=>{

        const variables = {
            skip:0,
            limit: Limit,
            filters: filters
        }
        getProducts(variables);
        setSkip(0);

    }

    const handlePrice = (value) =>{

        const data = price;
        let array = [];

        for(let key in data){
            
            console.log('key', key);
            console.log('value', value);
            if(data[key]._id === parseInt(value, 10)){
                array = data[key].array;
            }

        }
        console.log('array', array);
        return array;

    }

    const handleFilters = (filters, catagory)=>{
        console.log(filters);
        const newFilters = {...Filters};
        console.log(newFilters);

        newFilters[catagory] = filters

        if(catagory === 'price'){
            let priceValues = handlePrice(filters);
            newFilters[catagory] = priceValues;
        }

        console.log(newFilters);
        showFilteredResults(newFilters);
        setFilters(newFilters);
    }

    const updateSearchTerms = (newSearchTerm) =>{

        console.log(newSearchTerm);
        const variables = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        } 

        setSkip(0);
        setSearchTerms(newSearchTerm);
        getProducts(variables);

    }

    return (

        <div style={{ width: '75%', margin: '3rem auto' }}>
            
            <div style={{ textAlign: 'center' }}>
                <h2> Let's Travel Somewhere <Icon type='rocket'/> </h2>
            </div>

            {/* filter */}
            <Row gutter={[16, 16]}>

                <Col lg={12} xs={24}>
                    <CheckBox
                        list={continents}
                        handleFilters={filters => handleFilters(filters, 'continents')}
                    />    
                </Col>
                <Col lg={12} xs={24}>
                    <RadioBox
                        list={price}
                        handleFilters={filters => handleFilters(filters, 'price')}
                    />    
                </Col>

            </Row>

            {/* search */}
            <div style={{ display:'flex', justifyContent:'flex-end', margin:'1rem' }}>
                <SearchFeature
                    refreshFunction={updateSearchTerms}
                />
            </div>

            { Products.length === 0 ? 
                <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>No post yet...</h2>
                </div>
                :
                <div>
                    <Row gutter={[ 16,16 ]}>
                        {renderCards}
                    </Row>
                </div>
            }
            <br/><br/>
            
            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={onLoadMore}>Load More</button>
                </div>
            }
            
        </div>
            
    )

}

export default LandingPage
