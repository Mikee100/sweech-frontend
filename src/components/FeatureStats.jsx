import React from 'react';
import { Truck, ShieldCheck, Headphones, Zap } from 'lucide-react';

const FeatureStats = () => {
    const features = [
        {
            icon: <Truck size={32} />,
            title: "Free Delivery",
            desc: "On orders over KSh 5,000"
        },
        {
            icon: <ShieldCheck size={32} />,
            title: "Genuine Products",
            desc: "100% Authentic quality"
        },
        {
            icon: <Headphones size={32} />,
            title: "24/7 Support",
            desc: "Online dedicated help"
        },
        {
            icon: <Zap size={32} />,
            title: "Fast Repair",
            desc: "Express technical service"
        }
    ];

    return (
        <div className="feature-stats container">
            <div className="feature-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-item">
                        <div className="feature-icon">{feature.icon}</div>
                        <div className="feature-info">
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureStats;
