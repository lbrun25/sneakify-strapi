import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import axios from "axios";
import dotenv from "dotenv";

interface Produit {
  old_id: string;
  date: string;
  guide: string;
  name: string;
  order: number;
  price: number | null;
  discount_price: number | null;
  discount_expiry: string | null;
  best_size: string | null;
  hold_or_sell: string | null;
  is_resellable: boolean;
  resell: boolean;
  retail: number | null;
  sku: string | null;
  resell_price: number | null;
  retail_price: number | null;
  place: string | null;
  taille: string | null;
  titre: string | null;
  description: string | null;
  likes: number;
  dislikes: number;
}

dotenv.config();

const csvFilePath = path.resolve(__dirname, "../data/produits.csv");
const API_URL = `http://${process.env.HOST || "localhost"}:${process.env.PORT || 1337}/api/produits`;

const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error("Missing STRAPI_API_TOKEN in .env file");
  process.exit(1);
}

async function importProduits() {
  const produits: Produit[] = [];

  // Parse CSV file
  const parser = fs.createReadStream(csvFilePath).pipe(
    parse({
      columns: true, // Treat the first row as headers
      delimiter: ";", // Semicolon as the delimiter
      relax_quotes: true, // Relax rules for quotes
      skip_empty_lines: true, // Ignore empty rows
    })
  );

  for await (const row of parser) {
    const produit: Produit = {
      old_id: row.id,
      date: row.date,
      guide: row.guide || "",
      name: row.newName || "",
      order: parseInt(row.order, 10) || 0,
      price: parseFloat(row.price) || null,
      discount_price: parseFloat(row.discount_price) || null,
      discount_expiry: row.discount_expiry || null,
      best_size: row.bestSize || null,
      hold_or_sell: row.holdOrSell || null,
      is_resellable: row.resell === "true",
      resell: row.resell === "true",
      retail: parseFloat(row.retail) || null,
      sku: row.sku || null,
      resell_price: parseFloat(row.resellPrice) || null,
      retail_price: parseFloat(row.retailPrice) || null,
      place: row.place || null,
      taille: row.taille || null,
      titre: row.titre || null,
      description: row.newDescription || "",
      likes: parseInt(row.likes, 10) || 0,
      dislikes: parseInt(row.dislikes, 10) || 0,
    };

    produits.push(produit);
  }

  // Post data to Strapi
  for (const produit of produits) {
    try {
      const response = await axios.post(
        API_URL,
        {
          data: produit,
        },
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      console.log(`Produit importé : ${produit.name}`);
    } catch (error) {
      console.error(`Erreur lors de l'import de : ${produit.name}`);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Name:", error.response.data?.error?.name || "Unknown");
        console.error("Message:", error.response.data?.error?.message || "No message");

        if (error.response.data?.error?.details?.errors) {
          console.error("Details:", JSON.stringify(error.response.data.error.details.errors, null, 2));
        } else {
          console.error("No detailed errors provided.");
        }
      } else {
        console.error("Error:", error.message || "Unknown error");
      }
    }
  }
  console.log("Importation terminée !");
}

importProduits().catch((error) => console.error("Erreur principale :", error));
