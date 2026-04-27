import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const products = useSelector((state: RootState) => state.products.products);
  const [isOpen, setIsOpen] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(2);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey there! I'm Baby AI, your friendly sneaker buddy at Baby Sneakers! 🏀👟 I'm here to help you discover amazing shoes from our collection of Nike, Air Jordan, Puma, Reebok, Timberland, and All Star brands. What can I help you find today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (
    userMessage: string,
    conversationHistory: Message[]
  ): string => {
    const message = userMessage.toLowerCase();

    // Get recent context (last 5 messages for context)
    const recentMessages = conversationHistory
      .slice(-5)
      .filter((msg) => !msg.isBot)
      .map((msg) => msg.text.toLowerCase());

    // Check for follow-up questions
    const hasAskedAboutSports = recentMessages.some(
      (msg) =>
        msg.includes("sports") ||
        msg.includes("running") ||
        msg.includes("basketball") ||
        msg.includes("soccer") ||
        msg.includes("tennis")
    );
    const hasAskedAboutKids = recentMessages.some(
      (msg) => msg.includes("baby") || msg.includes("kids")
    );
    // Note: follow-up logic uses `hasAskedAboutSports` and `hasAskedAboutKids` plus current message checks

    // Contextual follow-up responses
    if (hasAskedAboutSports && message.includes("size")) {
      return "For athletic shoes, sizing can vary by brand and sport. Nike and Jordan tend to run true to size, while some Puma models fit slightly narrow. For basketball shoes, consider going up 0.5 size for ankle support. Running shoes should have thumb-width space at the toe. What sport are you interested in sizing for?";
    }

    if (hasAskedAboutSports && message.includes("color")) {
      return "Sports shoes come in various colors depending on the brand and season. Nike often has bright, energetic colorways, Jordan releases limited edition colors that become highly sought-after, Puma offers bold patterns, and Reebok has retro-inspired palettes. Many brands release seasonal colorways - what sport interests you most?";
    }

    if (hasAskedAboutKids && message.includes("size")) {
      return "Kids' shoe sizing is crucial for healthy development! Measure both feet and choose the larger size. General guide: 0-3 months (size 1-2), 3-6 months (size 2-3), 6-9 months (size 3-4), 9-12 months (size 4-5), 12-18 months (size 5-6), 18-24 months (size 6-7). Kids' sizes start from 8-13 for ages 4-6, then youth sizes. Always leave thumb-width space at the toe!";
    }

    if (hasAskedAboutKids && message.includes("color")) {
      return "Kids' shoes come in fun, vibrant colors! Popular choices include classic white, navy, pink, gray, and bright patterns. Many brands offer seasonal colorways and limited editions. For babies, soft pastels and neutrals are popular, while older kids love bold colors and designs. What colors does your little one prefer?";
    }

    if (
      hasAskedAboutSports &&
      (message.includes("price") || message.includes("cost"))
    ) {
      return "Sports shoe prices vary by brand and performance level. Entry-level athletic shoes start around $80-100, mid-range performance shoes are $100-150, while premium models from Nike, Jordan, or specialized brands can be $150-250+. Limited edition Jordans often exceed $200. What type of sports shoes are you looking for?";
    }

    if (
      hasAskedAboutKids &&
      (message.includes("price") || message.includes("cost"))
    ) {
      return "Kids' athletic shoes are generally more affordable than adult versions. Basic kids' sneakers range from $30-60, while premium brands like Nike or Jordan kids' shoes are $60-120. Baby shoes are typically $20-40. Prices depend on brand and features - what age group are you shopping for?";
    }

    // Brand-specific responses with product checking
    if (message.includes("nike")) {
      const nikeProducts = products.filter(
        (p) =>
          p.name.toLowerCase().includes("nike") ||
          p.description.toLowerCase().includes("nike")
      );
      let response =
        "Nike offers incredible athletic performance with innovative technologies like Air cushioning, Flyknit uppers, and React foam. ";

      if (nikeProducts.length > 0) {
        const prices = nikeProducts.map((p) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const avgPrice = Math.round(
          prices.reduce((a, b) => a + b, 0) / prices.length
        );
        response += `We currently have ${nikeProducts.length} Nike styles with an average price of $${avgPrice} (ranging from $${minPrice} to $${maxPrice}). `;

        // Extract colors and categories
        const colors = [
          ...new Set(
            nikeProducts
              .map(
                (p) =>
                  p.description
                    ?.toLowerCase()
                    .match(
                      /(black|white|red|blue|green|yellow|orange|purple|pink|gray|grey|navy|brown|tan|beige|silver|gold)/g
                    ) || []
              )
              .flat()
          ),
        ];
        const categories = [
          ...new Set(nikeProducts.map((p) => p.category).filter(Boolean)),
        ];

        if (colors.length > 0) {
          response += `Available colors include: ${colors
            .slice(0, 5)
            .join(", ")}${colors.length > 5 ? " and more" : ""}. `;
        }
        if (categories.length > 0) {
          response += `Categories: ${categories.join(", ")}. `;
        }

        if (nikeProducts.length <= 3) {
          response += "Our current Nike products:\n";
          nikeProducts.forEach((product) => {
            response += `• ${product.name}: $${product.price} - ${
              product.description || "Premium athletic footwear"
            }\n`;
          });
        }
      } else {
        response +=
          "We carry their latest sneakers, running shoes, basketball shoes, and lifestyle sneakers. Popular models include Air Force 1, Air Max, and Dunk.";
      }
      response +=
        " Nike typically offers excellent value with frequent promotions and sales!";
      return response;
    }

    if (message.includes("air jordan") || message.includes("jordan")) {
      const jordanProducts = products.filter(
        (p) =>
          p.name.toLowerCase().includes("jordan") ||
          p.description.toLowerCase().includes("jordan")
      );
      let response =
        "Air Jordan sneakers are legendary! From the iconic AJ1 that started it all to the latest retro releases, ";

      if (jordanProducts.length > 0) {
        const prices = jordanProducts.map((p) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        response += `we currently have ${jordanProducts.length} authentic Jordans priced from $${minPrice} to $${maxPrice}. `;
        if (jordanProducts.length <= 3) {
          response += "Our current Jordan products:\n";
          jordanProducts.forEach((product) => {
            response += `• ${product.name}: $${product.price}\n`;
          });
        }
      } else {
        response +=
          "we carry authentic Jordans with premium materials and performance features.";
      }
      response +=
        " These are highly sought-after - let me connect you with our support team for availability and current pricing.";
      return response;
    }

    if (message.includes("puma")) {
      const pumaProducts = products.filter(
        (p) =>
          p.name.toLowerCase().includes("puma") ||
          p.description.toLowerCase().includes("puma")
      );
      let response =
        "Puma delivers style and performance with their distinctive formstrip design. ";

      if (pumaProducts.length > 0) {
        const prices = pumaProducts.map((p) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        response += `We currently have ${pumaProducts.length} Puma styles priced from $${minPrice} to $${maxPrice}. `;
        if (pumaProducts.length <= 3) {
          response += "Our current Puma products:\n";
          pumaProducts.forEach((product) => {
            response += `• ${product.name}: $${product.price}\n`;
          });
        }
      } else {
        response +=
          "We stock their soccer cleats, running shoes, and lifestyle sneakers including the popular RS series and Suede models.";
      }
      response += " Great for both sports and streetwear!";
      return response;
    }

    if (message.includes("reebok")) {
      const reebokProducts = products.filter(
        (p) =>
          p.name.toLowerCase().includes("reebok") ||
          p.description.toLowerCase().includes("reebok")
      );
      let response =
        "Reebok classics like the Club C and Instapump are timeless. ";

      if (reebokProducts.length > 0) {
        const prices = reebokProducts.map((p) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        response += `We currently have ${reebokProducts.length} Reebok styles priced from $${minPrice} to $${maxPrice}. `;
        if (reebokProducts.length <= 3) {
          response += "Our current Reebok products:\n";
          reebokProducts.forEach((product) => {
            response += `• ${product.name}: $${product.price}\n`;
          });
        }
      } else {
        response +=
          "We carry their athletic shoes, training gear, and retro styles.";
      }
      response +=
        " Known for comfort and durability in both sports and casual wear.";
      return response;
    }

    if (message.includes("timberland")) {
      const timberlandProducts = products.filter(
        (p) =>
          p.name.toLowerCase().includes("timberland") ||
          p.description.toLowerCase().includes("timberland")
      );
      let response = "Timberland boots are built tough for any terrain. ";

      if (timberlandProducts.length > 0) {
        const prices = timberlandProducts.map((p) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        response += `We currently have ${timberlandProducts.length} Timberland styles priced from $${minPrice} to $${maxPrice}. `;
        if (timberlandProducts.length <= 3) {
          response += "Our current Timberland products:\n";
          timberlandProducts.forEach((product) => {
            response += `• ${product.name}: $${product.price}\n`;
          });
        }
      } else {
        response +=
          "We offer their iconic 6-inch boots, Earthkeepers collection, and casual styles.";
      }
      response +=
        " Premium leather construction with excellent waterproofing - perfect for outdoor adventures.";
      return response;
    }

    if (message.includes("all star") || message.includes("converse")) {
      const converseProducts = products.filter(
        (p) =>
          p.name.toLowerCase().includes("converse") ||
          p.name.toLowerCase().includes("all star") ||
          p.description.toLowerCase().includes("converse") ||
          p.description.toLowerCase().includes("all star")
      );
      let response = "Converse All Stars are the original sneakers! ";

      if (converseProducts.length > 0) {
        const prices = converseProducts.map((p) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        response += `We currently have ${converseProducts.length} Converse styles priced from $${minPrice} to $${maxPrice}. `;
        if (converseProducts.length <= 3) {
          response += "Our current Converse products:\n";
          converseProducts.forEach((product) => {
            response += `• ${product.name}: $${product.price}\n`;
          });
        }
      } else {
        response +=
          "We carry Chuck Taylor high-tops, low-tops, and platform styles in various colors.";
      }
      response +=
        " Iconic canvas construction with the signature rubber toe cap - endlessly customizable and timeless.";
      return response;
    }

    // Sports and athletics responses
    if (
      message.includes("sports") ||
      message.includes("athletics") ||
      message.includes("athletic")
    ) {
      return "Sports and athletics demand specialized footwear! We carry performance shoes for running, basketball, soccer, tennis, and training. Nike excels in basketball and running, Jordan dominates hoops, Puma shines in soccer, and Reebok offers versatile training gear. Each sport requires specific features like cushioning, traction, and support. What sport are you interested in?";
    }

    if (message.includes("running") || message.includes("jogging")) {
      return "Running shoes are essential for injury prevention and performance! We carry Nike Pegasus and Alphafly for road running, Brooks Ghost for everyday jogs, and specialized trail runners from Salomon. Key features include cushioning, stability, and breathability. Replace every 300-500 miles. What type of running do you do - road, trail, or track?";
    }

    if (message.includes("basketball")) {
      return "Basketball shoes need ankle support and traction for quick cuts! Air Jordans are legendary for the sport, while Nike LeBron and Kyrie models offer high performance. High-tops provide maximum stability, low-tops offer flexibility. Herringbone outsoles prevent slipping. Perfect for both court and street style!";
    }

    if (message.includes("soccer") || message.includes("football")) {
      return "Soccer cleats require superior traction and ball control! Puma King and Future boots dominate with innovative stud patterns, Adidas Predators excel in touch, and Nike Mercurial offers speed. Choose bladed studs for firm ground, molded for turf. Essential for any serious player!";
    }

    if (message.includes("tennis")) {
      return "Tennis shoes need lateral support and durable outsoles! We carry Wilson Pro Staff for clay courts, Adidas Stan Smith for versatility, and specialized models for hard courts. Herringbone patterns provide traction, while cushioning absorbs impact. Great for both matches and casual wear!";
    }

    // Baby and kids shoes responses
    if (
      message.includes("baby") ||
      message.includes("kids") ||
      message.includes("children") ||
      message.includes("toddler")
    ) {
      return "We understand the importance of proper footwear for growing feet! While our main focus is premium adult brands, we can help with recommendations for kids' athletic shoes. For babies and toddlers, look for flexible soles, good arch support, and breathable materials. Brands like Nike, Adidas, and Puma offer excellent kids' lines. What age group or specific needs are you looking for?";
    }

    if (message.includes("baby sneaker") || message.includes("kids sneaker")) {
      return "Baby and kids sneakers should prioritize comfort and development! Look for flexible soles that allow natural foot movement, good arch support to prevent flat feet, and adjustable straps for growing feet. Premium materials prevent odor and provide cushioning. We recommend measuring feet monthly as kids grow quickly. Size up 0.5-1 size for growing room!";
    }

    if (
      message.includes("baby size") ||
      message.includes("kids size") ||
      (message.includes("size") &&
        (message.includes("baby") || message.includes("kids")))
    ) {
      return "Baby and kids shoe sizing is crucial for healthy development! Measure both feet and choose the larger size. General guide: 0-3 months (size 1-2), 3-6 months (size 2-3), 6-9 months (size 3-4), 9-12 months (size 4-5), 12-18 months (size 5-6), 18-24 months (size 6-7). Kids' sizes start from 8-13 for ages 4-6, then youth sizes. Always leave thumb-width space at the toe!";
    }

    if (
      message.includes("baby color") ||
      message.includes("kids color") ||
      (message.includes("color") &&
        (message.includes("baby") || message.includes("kids")))
    ) {
      return "Kids' shoes come in fun, vibrant colors! Popular choices include classic white, navy, pink, gray, and bright patterns. Many brands offer seasonal colorways and limited editions. For babies, soft pastels and neutrals are popular, while older kids love bold colors and designs. What colors does your little one prefer?";
    }

    // Product availability and shopping
    if (
      message.includes("available") ||
      message.includes("stock") ||
      message.includes("in stock")
    ) {
      return "Let me connect you with our support team for the latest stock and prices. They can check real-time availability across all our Nike, Jordan, Puma, Reebok, Timberland, and Converse products!";
    }

    if (message.includes("size") || message.includes("sizing")) {
      return "We carry sizes from men's/women's 4-15 and kids' sizes. For athletic shoes, we recommend trying them on as fit can vary by brand. Nike and Jordan tend to run true to size, while some Puma models fit slightly narrow. Let me connect you with support for specific sizing help!";
    }

    if (message.includes("color") || message.includes("colors")) {
      return "We offer extensive color options across all brands! From classic black/white combinations to vibrant colorways and limited edition releases. Each brand has seasonal drops with unique colors. Check our current inventory for the latest options!";
    }

    if (
      message.includes("price") ||
      message.includes("cost") ||
      message.includes("expensive")
    ) {
      if (products.length > 0) {
        const prices = products.map((p) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const avgPrice = Math.round(
          prices.reduce((a, b) => a + b, 0) / prices.length
        );

        let response = `Our sneakers range from $${minPrice} to $${maxPrice}. `;

        if (products.length <= 5) {
          response += "Here are our current products:\n";
          products.forEach((product) => {
            response += `• ${product.name}: $${product.price}\n`;
          });
        } else {
          response += `Average price is around $${avgPrice}. We often have promotions and sales on select brands!`;
        }

        return response;
      } else {
        return "Our sneakers range from $80-$250 depending on the brand and style. Premium brands like Jordan and Nike are at the higher end, while Timberland and Converse offer more affordable options. Let me connect you with our support team for current pricing and any ongoing promotions!";
      }
    }

    // Shipping and returns
    if (message.includes("shipping") || message.includes("delivery")) {
      return "We offer free shipping on orders over $100! Standard shipping takes 3-5 business days, express 1-2 days, and overnight options available. International shipping is also offered with rates calculated at checkout.";
    }

    if (message.includes("return") || message.includes("refund")) {
      return "We accept returns within 30 days for unused items in original packaging with tags attached. Athletic shoes can be tried on but must be returned in resalable condition. Refunds are processed within 5-7 business days of receipt.";
    }

    // Customer service
    if (
      message.includes("support") ||
      message.includes("help") ||
      message.includes("contact")
    ) {
      return "Our customer service team is here to help! You can reach them at support@babysneakers.com or call 1-800-SNEAKERS. They're experts on all our brands and can help with sizing, availability, and special orders.";
    }

    // Brand comparisons
    if (
      message.includes("compare") ||
      message.includes("vs") ||
      message.includes("better")
    ) {
      return "Each brand has unique strengths: Nike excels in innovation and performance, Jordan offers premium basketball heritage, Puma provides style with athletic pedigree, Reebok delivers comfort classics, Timberland specializes in rugged durability, and Converse gives timeless versatility. It depends on your needs - sports performance, fashion, or everyday wear!";
    }

    // General responses
    if (
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("hey")
    ) {
      return "Hello! Welcome to Baby Sneakers! How can I help you find the perfect pair from our Nike, Jordan, Puma, Reebok, Timberland, or Converse collection?";
    }

    if (message.includes("thank") || message.includes("thanks")) {
      return "You're welcome! Happy shopping at Baby Sneakers. Feel free to ask if you have more questions about our brands or products!";
    }

    // Product information
    if (message.includes("product") || message.includes("products")) {
      if (products.length > 0) {
        let response = `We currently have ${products.length} products available from our premium brands. `;

        if (products.length <= 5) {
          response += "Here are our current products:\n";
          products.forEach((product) => {
            response += `• ${product.name}: $${product.price} - ${product.description}\n`;
          });
        } else {
          const categories = [
            ...new Set(products.map((p) => p.category).filter(Boolean)),
          ];
          response += `We offer styles in categories: ${categories.join(
            ", "
          )}. `;
          response +=
            "Browse our collection of Nike, Air Jordan, Puma, Reebok, Timberland, and All Star sneakers!";
        }

        return response;
      } else {
        return "We offer an amazing selection of sneakers from premium brands: Nike (Air Max, Air Force 1), Air Jordan (retro and current models), Puma (RS series, Suede), Reebok (Club C, Instapump), Timberland (6-inch boots, Earthkeepers), and Converse All Stars. Something for every style and activity!";
      }
    }

    // Privacy policy information
    if (message.includes("privacy") || message.includes("data")) {
      return "Your privacy is important to us. We collect only necessary information to process orders and provide excellent service. We never sell your personal data to third parties. For full details, please read our Privacy Policy at /privacy.";
    }

    // Terms of service
    if (
      message.includes("terms") ||
      message.includes("service") ||
      message.includes("conditions")
    ) {
      return "Our Terms of Service outline the rules for using our website and services. Key points include: lawful use only, account responsibility, order acceptance, shipping policies, and intellectual property rights. Full terms available at /terms.";
    }

    // Cookie policy
    if (message.includes("cookie") || message.includes("cookies")) {
      return "We use cookies to enhance your browsing experience, remember your preferences, and provide analytics. Essential cookies are required for the site to function, while others help us improve our services. You can manage cookie preferences in your browser settings. Full policy at /cookies.";
    }

    // General shoe knowledge
    if (message.includes("dress shoes") || message.includes("formal shoes")) {
      return "Dress shoes are designed for formal occasions and professional settings. Types include oxfords (closed lacing), derbies (open lacing), loafers (slip-on), brogues (decorative perforations), and monk straps. Materials typically include leather, suede, or patent leather. Proper care involves regular polishing, using shoe trees for shape retention, and conditioning leather monthly. Always break them in gradually to avoid blisters.";
    }

    if (
      message.includes("athletic shoes") ||
      message.includes("sports shoes") ||
      message.includes("running shoes")
    ) {
      return "Athletic shoes are specialized for different sports: Running shoes (cushioned soles, motion control), basketball shoes (high-tops for ankle support), soccer cleats (studded soles for traction), tennis shoes (lateral support), and cross-training shoes (versatile for multiple activities). Key features include arch support, shock absorption, breathability, and sport-specific traction patterns. Replace every 300-500 miles or 6-12 months of regular use.";
    }

    if (
      message.includes("casual shoes") ||
      message.includes("everyday shoes")
    ) {
      return "Casual shoes include sneakers, loafers, boat shoes, espadrilles, and mules. They're designed for comfort and versatility in non-formal settings. Look for breathable materials, good cushioning, and flexible soles. Canvas or leather uppers are common. Care involves regular cleaning and proper storage to maintain shape. Many casual shoes can be machine washed, but check labels first.";
    }

    if (message.includes("boot") || message.includes("boots")) {
      return "Boots come in many styles: ankle boots, knee-high boots, riding boots, combat boots, and snow boots. Materials range from leather and suede to rubber and synthetic fabrics. Waterproofing treatments are essential for wet weather. Proper fit is crucial - boots should be comfortable from the first wear. Use boot trees to maintain shape and prevent creases. Clean regularly and apply appropriate conditioners based on material.";
    }

    if (message.includes("sandal") || message.includes("sandals")) {
      return "Sandals include flip-flops, gladiator sandals, espadrilles, and Birkenstocks. They're perfect for warm weather and casual wear. Look for arch support and cushioning for all-day comfort. Materials like leather, cork, or synthetic straps. Clean with mild soap and water, air dry completely. Some sandals can be worn year-round with socks in cooler weather.";
    }

    if (message.includes("heel") || message.includes("high heels")) {
      return "High heels range from kitten heels (1-2 inches) to stilettos (4+ inches). They elongate legs but require practice for comfort. Choose wide heels for stability and cushioned insoles for shock absorption. Break them in gradually and limit wear time to prevent foot pain. Many women alternate with flats throughout the day. Proper posture is key when wearing heels.";
    }

    if (message.includes("flat") || message.includes("flats")) {
      return "Flats include ballet flats, loafers, oxfords, and mules. They're comfortable for all-day wear and come in various materials like leather, suede, or fabric. Look for good arch support and cushioning. Pointed toes elongate feet while rounded toes are more comfortable. Many flats can be dressed up or down depending on the occasion.";
    }

    if (
      message.includes("shoe material") ||
      message.includes("leather") ||
      message.includes("suede")
    ) {
      return "Shoe materials greatly affect comfort and durability: Full-grain leather (most durable, develops patina), suede (soft, breathable but stains easily), synthetic leather (water-resistant, affordable), canvas (breathable, casual), and rubber (waterproof, durable). Natural materials breathe better but require more care. Synthetic materials are often easier to maintain but may not last as long.";
    }

    if (
      message.includes("shoe care") ||
      message.includes("cleaning") ||
      message.includes("maintenance")
    ) {
      return "Shoe care depends on material: Leather - use cream polish and soft brush. Suede - use suede brush and protector spray. Canvas - machine washable or spot clean. Regularly remove laces for cleaning. Use shoe trees to maintain shape. Apply weather protection for wet conditions. Professional cleaning recommended for expensive pairs. Store in cool, dry place away from direct sunlight.";
    }

    if (message.includes("shoe size") || message.includes("measurement")) {
      return "Proper shoe sizing is crucial for comfort and foot health. Measure feet at end of day when slightly swollen. Use a Brannock device for accuracy. Length and width both matter - many people need different sizes for each foot. Athletic shoes often run larger than dress shoes. Kids' feet grow quickly - measure every 2-3 months. When trying shoes, ensure thumb-width space at toe and heel locks comfortably.";
    }

    if (message.includes("shoe history") || message.includes("evolution")) {
      return "Shoes evolved from protective foot coverings to fashion statements. Ancient Egyptians wore sandals, Romans developed closed shoes, medieval Europeans wore wooden clogs. Industrial revolution brought mass production. Athletic shoes emerged in late 19th century with basketball and running shoes. Modern era features specialized sports footwear, orthopedic designs, and sustainable materials. Fashion shoes reflect cultural trends and technological advancements.";
    }

    if (message.includes("shoe fashion") || message.includes("trends")) {
      return "Shoe fashion reflects seasons and culture: Spring/Summer - bright colors, open designs, sandals. Fall/Winter - boots, rich materials, neutral tones. Current trends include sustainable materials, gender-neutral designs, platform soles, and vintage revivals. Classic styles like loafers and sneakers remain timeless. Comfort is increasingly important alongside style.";
    }

    if (
      message.includes("comfortable shoes") ||
      message.includes("best shoes")
    ) {
      return "Comfortable shoes prioritize fit, cushioning, and support. Look for contoured insoles, flexible soles, breathable materials, and proper arch support. Brands like Brooks, New Balance, and Clarks specialize in comfort. Avoid shoes that feel tight or require breaking in. Comfort should be immediate, not earned. Consider orthotic inserts for additional support. Remember that the most expensive shoes aren't always the most comfortable.";
    }

    if (message.includes("shoe brands") || message.includes("popular brands")) {
      return "Popular shoe brands include: Nike (athletic, innovative technology), Adidas (sportswear, retro styles), Converse (classic sneakers), Vans (skate culture), New Balance (comfort running), Brooks (premium running), Clarks (comfort dress shoes), Dr. Martens (durable boots), Birkenstock (contoured sandals), and Crocs (casual, comfortable). Each brand has specialties and target markets.";
    }

    // Sports and sports shoes knowledge
    if (message.includes("sports") || message.includes("sport")) {
      return "Sports encompass a wide range of physical activities from team sports like soccer and basketball to individual pursuits like running and tennis. Each sport demands specific footwear for optimal performance, injury prevention, and comfort. The evolution of sports shoes has revolutionized athletic performance, with innovations in cushioning, traction, and support systems. Modern sports shoes incorporate advanced materials like Flyknit, Boost foam, and specialized outsoles designed for different playing surfaces.";
    }

    if (message.includes("nike")) {
      return "Nike revolutionized athletic footwear with the Air Jordan line and innovative technologies like Air cushioning, Flyknit, and React foam. Founded in 1964 as Blue Ribbon Sports, Nike became synonymous with performance athletics. Their sports shoes feature cutting-edge design, premium materials, and athlete endorsements from Michael Jordan to Serena Williams. Nike's commitment to sustainability includes recycled materials and carbon-neutral manufacturing goals.";
    }

    if (message.includes("puma") || message.includes("pumas")) {
      return "Puma, founded in 1948 by Rudolf Dassler, is renowned for soccer cleats and lifestyle sneakers. Their King and Future football boots feature innovative stud patterns for superior traction. Puma pioneered the use of formstrip technology and continues to innovate with PWRRUN foam and PWRFRAME stability systems. The brand's heritage in track and field, combined with collaborations with designers like Rihanna, makes Puma a versatile sports and fashion footwear choice.";
    }

    if (message.includes("all star") || message.includes("converse")) {
      return "Converse All Stars, introduced in 1917, became iconic through basketball legend Chuck Taylor's endorsement. The classic high-top design features a durable canvas upper, rubber toe cap, and signature ankle patch. All Stars transcend sports, becoming cultural symbols in music, fashion, and streetwear. Their minimalist design allows for customization and self-expression, making them timeless beyond the basketball court.";
    }

    if (message.includes("adidas")) {
      return "Adidas, founded in 1949, pioneered soccer cleats with the revolutionary Copa Mundial in 1979. Their Boost technology transformed running shoes with energy-returning foam. Adidas dominates multiple sports with specialized footwear: Predator for soccer control, Stan Smith for tennis, and Ultraboost for running. The brand's three-stripe logo and collaborations with Kanye West and Pharrell Williams blend performance with fashion innovation.";
    }

    if (message.includes("new balance")) {
      return "New Balance, established in 1906, specializes in comfort and fit with their unique sizing system (width fittings from AAA to EEE). Their 574 model became a streetwear staple, while the FuelCell foam provides exceptional cushioning. New Balance focuses on inclusivity with diverse sizing and sustainable practices. Their Boston headquarters reflects their American manufacturing heritage and commitment to quality over trends.";
    }

    if (message.includes("reebok") || message.includes("reeboks")) {
      return "Reebok, founded in 1895, gained fame through aerobics in the 1980s with the Freestyle and Pump technologies. Their Hexalite cushioning and DMX foam were groundbreaking. Reebok's partnership with the NFL and NBA cemented their sports credibility. Today, Reebok emphasizes sustainability with ocean plastic-derived materials and continues to innovate in fitness and lifestyle categories.";
    }

    if (message.includes("under armour") || message.includes("underarmour")) {
      return "Under Armour, launched in 1996, revolutionized performance apparel and footwear with moisture-wicking fabrics. Their Curry and Harden basketball shoes feature innovative cushioning systems. Under Armour's Charged cushioning and HOVR technology provide responsive comfort. The brand's focus on data-driven design and athlete performance makes them a leader in technical athletic footwear.";
    }

    if (message.includes("asics") || message.includes("asics")) {
      return "ASICS, founded in 1949, means 'Sound Mind, Sound Body' in Latin. Their GEL technology revolutionized shock absorption in running shoes. ASICS dominates distance running with models like the Kayano for stability and Nimbus for cushioning. The brand's scientific approach to footwear design, based on biomechanical research, makes them preferred by serious runners and athletes worldwide.";
    }

    if (message.includes("vans") || message.includes("vans")) {
      return "Vans, established in 1966, became synonymous with skateboarding culture. Their Old Skool model with the sidestripe logo defined street fashion. Vans' waffle sole provides excellent grip for skateboarding and other activities. The brand's commitment to authenticity and collaborations with artists and athletes keeps Vans at the forefront of action sports footwear.";
    }

    if (message.includes("jordan") || message.includes("air jordan")) {
      return "Air Jordan revolutionized basketball footwear when Michael Jordan wore the AJ1 in 1985. Each model features innovative technologies like Air cushioning, Zoom Air, and Flyknit. The brand transcends sports, becoming a cultural phenomenon in fashion and streetwear. Jordan's limited releases and retro models create immense demand, making them highly collectible while maintaining athletic performance.";
    }

    if (message.includes("soccer") || message.includes("football")) {
      return "Soccer cleats evolved from heavy leather boots to lightweight, specialized footwear. Modern designs feature different stud patterns: bladed studs for firm ground, molded studs for artificial turf, and detachable studs for versatility. Brands like Adidas, Nike, and Puma compete fiercely in soccer footwear innovation, with technologies like Flyknit uppers and energy-returning foams enhancing player performance.";
    }

    if (message.includes("basketball")) {
      return "Basketball shoes prioritize ankle support, cushioning, and traction for quick directional changes. High-tops provide maximum stability, while low-tops offer flexibility. Technologies like Zoom Air, Boost foam, and herringbone outsoles prevent slipping. Basketball shoes have become fashion statements, with limited-edition colorways driving cultural impact beyond the court.";
    }

    if (message.includes("running") || message.includes("jogging")) {
      return "Running shoes evolved from basic canvas sneakers to sophisticated performance footwear. Key innovations include air cushioning, gel inserts, and energy-returning foams. Running shoes are categorized by gait: neutral for normal pronation, stability for overpronation, and motion control for severe overpronation. Proper running shoes prevent injuries and enhance performance across distances from 5K to ultramarathons.";
    }

    if (message.includes("tennis")) {
      return "Tennis shoes require lateral support for quick side-to-side movements and durable outsoles for clay, grass, and hard courts. Technologies like herringbone patterns provide traction while cushioning systems absorb impact. Tennis shoes have become stylish off-court wear, with clean designs that transition from sport to street fashion seamlessly.";
    }

    if (message.includes("training") || message.includes("cross training")) {
      return "Cross-training shoes bridge multiple athletic activities, offering versatility for gym workouts, light running, and casual wear. They feature moderate cushioning, good stability, and durable outsoles. Modern cross-trainers incorporate technologies from various sports, making them ideal for fitness enthusiasts who participate in multiple activities.";
    }

    if (message.includes("buying shoes") || message.includes("shoe shopping")) {
      return "Smart shoe shopping tips: Shop in afternoon when feet are largest. Bring both shoes you're wearing and the ones you plan to wear with new purchase. Walk around store to test comfort. Check return policies. Consider online reviews and fit guides. Don't buy shoes that need 'breaking in' - they should be comfortable immediately. Invest in quality over quantity for better long-term value.";
    }

    if (
      message.includes("shoe problems") ||
      message.includes("foot pain") ||
      message.includes("blisters")
    ) {
      return "Common shoe-related problems: Blisters (from friction - use moleskin), bunions (narrow toe boxes), plantar fasciitis (lack of support), heel pain (poor cushioning), ingrown toenails (tight shoes). Solutions include proper sizing, cushioned insoles, stretching exercises, and consulting podiatrists. Prevention is key - don't ignore early discomfort. Replace worn shoes regularly to avoid injury.";
    }

    // Default response
    return "I'd be happy to help with any questions about shoes! You can ask me about our Nike, Jordan, Puma, Reebok, Timberland, and Converse brands, athletic shoes, dress shoes, casual footwear, boots, sandals, shoe care, sizing, fashion trends, comfort tips, or shopping advice. What would you like to know?";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const currentInput = inputValue;
    const userMessageId = messageIdCounter;
    const userMessage: Message = {
      id: userMessageId,
      text: currentInput,
      isBot: false,
      timestamp: new Date(),
    };

    setMessageIdCounter((prev) => prev + 1);
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      setMessages((prev) => {
        const botResponse: Message = {
          id: userMessageId + 1,
          text: getBotResponse(currentInput, prev),
          isBot: true,
          timestamp: new Date(),
        };
        return [...prev, botResponse];
      });
      setMessageIdCounter((prev) => prev + 1);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:opacity-90 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Open chat"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white p-4 rounded-t-2xl">
            <h3 className="font-semibold text-lg">Baby AI</h3>
            <p className="text-sm opacity-90">
              Your friendly sneaker buddy! 👟
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.isBot
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm"
                      : "bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white rounded-br-sm"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-2xl rounded-bl-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
