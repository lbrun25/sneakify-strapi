import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = `http://${process.env.HOST || "localhost"}:${process.env.PORT || 1337}/api/produits`;

const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error("Missing STRAPI_API_TOKEN in .env file");
  process.exit(1);
}

async function deleteAllProduits() {
  try {
    let page = 1;
    const pageSize = 100; // Adjust this to match your Strapi pagination settings
    let totalDeleted = 0;

    while (true) {
      const response = await axios.get(API_URL, {
        params: {
          pagination: {
            page,
            pageSize,
          },
        },
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });

      const produits = response.data?.data; // Adjust based on Strapi response format
      if (!Array.isArray(produits) || produits.length === 0) {
        console.log("No more produits found to delete.");
        break;
      }

      for (const produit of produits) {
        console.log(`Deleting produit with ID: ${produit.id}`);
        await axios.delete(`${API_URL}/${produit.id}`, {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        console.log(`Deleted produit with ID: ${produit.id}`);
        totalDeleted++;
      }

      console.log(`Page ${page} processed.`);
      page++;
    }

    console.log(`All produits deleted successfully! Total deleted: ${totalDeleted}`);
  } catch (error) {
    console.error("Error during deletion:", error.message || error);
  }
}

deleteAllProduits();
