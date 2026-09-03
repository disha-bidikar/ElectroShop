package com.electroshop.config;

import com.electroshop.entity.*;
import com.electroshop.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            ReviewRepository reviewRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User("admin", passwordEncoder.encode("admin123"), "admin@electroshop.com", "ROLE_ADMIN");
            User user = new User("user", passwordEncoder.encode("user123"), "user@electroshop.com", "ROLE_USER");
            userRepository.save(admin);
            userRepository.save(user);
        }

        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category("Laptop", "High performance laptops for programming, gaming & business", "Laptop"));
            categoryRepository.save(new Category("Mobile", "Flagship smartphones with AI cameras & 5G connectivity", "Smartphone"));
            categoryRepository.save(new Category("Accessories", "Premium audio, mice, keyboards & charging gear", "Headphones"));
            categoryRepository.save(new Category("Wearable", "Smartwatches & fitness trackers", "Watch"));
            categoryRepository.save(new Category("Gaming", "Console gear, controllers & high refresh monitors", "Gamepad"));
        }

        if (productRepository.count() == 0) {
            Product p1 = new Product(
                    "MacBook Pro 16 M3 Max", "Apple", "Laptop", 249900.0,
                    "Ultimate workstation for software developers, video editors, and AI engineers.",
                    "CPU: M3 Max (16-core), RAM: 36GB Unified, Storage: 1TB SSD, GPU: 40-core, Display: 16.2 Liquid Retina XDR",
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop"
            );
            p1.setIsFeatured(true);
            p1.setRating(4.9);

            Product p2 = new Product(
                    "Lenovo Legion Pro 5", "Lenovo", "Laptop", 134990.0,
                    "High refresh rate gaming and coding laptop with dedicated RTX 4060 graphics.",
                    "CPU: AMD Ryzen 7 7745HX, RAM: 16GB DDR5, Storage: 1TB NVMe SSD, GPU: NVIDIA RTX 4060 8GB, Display: 16 WQXGA 240Hz",
                    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop"
            );
            p2.setRating(4.7);

            Product p3 = new Product(
                    "Dell XPS 15 Developer Edition", "Dell", "Laptop", 169990.0,
                    "Sleek aluminum chassis laptop designed specifically for software development & multitasking.",
                    "CPU: Intel Core i7 13700H, RAM: 32GB DDR5, Storage: 1TB SSD, GPU: Intel Arc A370M, Display: 15.6 3.5K OLED Touch",
                    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop"
            );
            p3.setIsFeatured(true);
            p3.setRating(4.8);

            Product p4 = new Product(
                    "ASUS ROG Zephyrus G14", "ASUS", "Laptop", 149990.0,
                    "Ultra-portable 14-inch power house laptop for programmers and creative professionals.",
                    "CPU: AMD Ryzen 9 8945HS, RAM: 16GB LPDDR5X, Storage: 1TB SSD, GPU: RTX 4060, Display: 14 ROG Nebula OLED 120Hz",
                    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop"
            );
            p4.setRating(4.6);

            Product p5 = new Product(
                    "Samsung Galaxy S24 Ultra", "Samsung", "Mobile", 129999.0,
                    "AI powered flagship smartphone with integrated S-Pen and 200MP camera system.",
                    "RAM: 12GB, Storage: 512GB, CPU: Snapdragon 8 Gen 3, Camera: 200MP + 50MP + 12MP, Battery: 5000mAh",
                    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop"
            );
            p5.setIsFeatured(true);
            p5.setRating(4.9);

            Product p6 = new Product(
                    "Apple iPhone 15 Pro", "Apple", "Mobile", 134900.0,
                    "Titanium design smartphone with A17 Pro chip and customizable Action button.",
                    "RAM: 8GB, Storage: 256GB, CPU: A17 Pro, Camera: 48MP Pro, Display: 6.1 Super Retina XDR OLED",
                    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop"
            );
            p6.setRating(4.8);

            Product p7 = new Product(
                    "Google Pixel 8 Pro", "Google", "Mobile", 84999.0,
                    "Pure Android AI experience with Tensor G3 chip and industry-leading photography capabilities.",
                    "RAM: 12GB, Storage: 128GB, CPU: Google Tensor G3, Camera: 50MP AI Lens, Battery: 5050mAh",
                    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop"
            );
            p7.setRating(4.5);

            Product p8 = new Product(
                    "Sony WH-1000XM5 Wireless Headphones", "Sony", "Accessories", 29990.0,
                    "Industry leading noise cancelling headphones with crystal clear call quality and 30-hour battery life.",
                    "Driver: 30mm, Battery: 30 hours, Connectivity: Bluetooth 5.2, Active Noise Cancellation: Dual Processor V1",
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop"
            );
            p8.setIsFeatured(true);
            p8.setRating(4.8);

            Product p9 = new Product(
                    "Logitech MX Master 3S Mouse", "Logitech", "Accessories", 9995.0,
                    "Ergonomic wireless productivity mouse with 8K DPI sensor and quiet click switches.",
                    "DPI: 8000, Sensor: Darkfield, Battery: 70 days rechargeable, Connectivity: Bluetooth / Logi Bolt",
                    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop"
            );
            p9.setRating(4.9);

            Product p10 = new Product(
                    "Apple Watch Ultra 2", "Apple", "Wearable", 89900.0,
                    "Rugged titanium smartwatch with precision dual-frequency GPS and up to 72h battery.",
                    "Display: 49mm Titanium, Brightness: 3000 nits, Battery: Up to 72 hours, Water Resistance: 100m",
                    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop"
            );
            p10.setRating(4.7);

            productRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10));

            // Seed initial reviews
            User demoUser = userRepository.findByUsername("user").orElse(null);
            if (demoUser != null) {
                reviewRepository.save(new Review(demoUser.getId(), demoUser.getUsername(), p1, 5.0, "Absolute powerhouse for Java and Spring Boot development! Compilation is instant."));
                reviewRepository.save(new Review(demoUser.getId(), demoUser.getUsername(), p1, 4.8, "Screen is gorgeous and keyboard travel is super comfortable for long coding sessions."));
                reviewRepository.save(new Review(demoUser.getId(), demoUser.getUsername(), p8, 5.0, "Best noise cancelling headphones I have ever used. Perfect for focusing in open office environments."));
            }
        }
    }
}
