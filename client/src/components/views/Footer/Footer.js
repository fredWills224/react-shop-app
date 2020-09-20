import React from 'react'
import { SmileOutlined } from '@ant-design/icons';

function Footer() {
    return (
        <div style={{
            height: '80px', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', fontSize:'1rem'
        }}>
           <span> Fred Wills </span>
           <span> github.com/fredWills224 <SmileOutlined/> </span>
        </div>
    )
}

export default Footer
