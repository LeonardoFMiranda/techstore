import { PrismaClient } from "@prisma/client";
import { toSlug } from "../lib/utils";

const prisma = new PrismaClient();

const products = [
  {
    name: "Fone de Ouvido Sony WH-1000XM5",
    description:
      "Fone de ouvido over-ear com cancelamento de ruído líder do setor. Bateria de 30 horas, conexão multidispositivo e qualidade de áudio excepcional. Ideal para trabalho remoto e viagens.",
    priceInCents: 179990,
    stock: 15,
    category: "Fones de Ouvido",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    ],
  },
  {
    name: "Teclado Mecânico Keychron K8 Pro",
    description:
      "Teclado mecânico TKL sem fio com switches intercambiáveis, retroiluminação RGB, compatível com Mac e Windows. Conexão Bluetooth 5.1 ou USB-C.",
    priceInCents: 69900,
    stock: 8,
    category: "Teclados",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80",
    ],
  },
  {
    name: "Mouse Logitech MX Master 3S",
    description:
      "Mouse ergonômico premium com scroll eletromagnético MagSpeed, sensor de 8000 DPI, botões silenciosos e até 70 dias de bateria. Conecte até 3 dispositivos.",
    priceInCents: 59900,
    stock: 20,
    category: "Mouses",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    ],
  },
  {
    name: "Monitor LG UltraWide 34\"",
    description:
      "Monitor UltraWide QHD 34\" com resolução 3440x1440, taxa de atualização 160Hz, 1ms GtG, suporte HDR10 e AMD FreeSync Premium. Perfeito para produtividade e gaming.",
    priceInCents: 399900,
    stock: 5,
    category: "Monitores",
    images: [
      "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&q=80",
    ],
  },
  {
    name: "Webcam Logitech Brio 4K",
    description:
      "Webcam 4K Ultra HD com HDR, zoom óptico 5x, correção automática de luz e campo de visão ajustável de 65°, 78° ou 90°. Compatível com Windows Hello.",
    priceInCents: 119990,
    stock: 12,
    category: "Webcams",
    images: [
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80",
    ],
  },
  {
    name: "SSD Samsung 980 Pro 1TB",
    description:
      "SSD NVMe PCIe 4.0 M.2 com velocidade de leitura sequencial de até 7.000 MB/s e escrita de 5.000 MB/s. Ideal para workstations e gaming de alta performance.",
    priceInCents: 49990,
    stock: 30,
    category: "Armazenamento",
    images: [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80",
    ],
  },
  {
    name: "Hub USB-C Anker 7-em-1",
    description:
      "Hub USB-C com HDMI 4K@30Hz, 2x USB-A 3.0, USB-C dados, leitor SD/microSD e carregamento PD de 100W. Compatível com MacBook, iPad Pro e laptops USB-C.",
    priceInCents: 17990,
    stock: 25,
    category: "Acessórios",
    images: [
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80",
    ],
  },
  {
    name: "Microfone Blue Yeti USB",
    description:
      "Microfone condensador USB profissional com quatro padrões polares: cardioide, bidirecional, omnidirecional e estéreo. Plug-and-play, sem necessidade de interface de áudio.",
    priceInCents: 89990,
    stock: 7,
    category: "Microfones",
    images: [
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80",
    ],
  },
  {
    name: "Suporte Ergonômico para Notebook",
    description:
      "Suporte ajustável em alumínio para notebooks de 10\" a 16\". Design dobrável e portátil, ventilação aprimorada e 7 ângulos de inclinação. Compatível com MacBook, Dell, Lenovo.",
    priceInCents: 14990,
    stock: 40,
    category: "Acessórios",
    images: [
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
    ],
  },
  {
    name: "Carregador Baseus 65W GaN",
    description:
      "Carregador GaN compacto 65W com 2x USB-C e 1x USB-A. Suporta PD 3.0 e QC 3.0. Carrega notebook, smartphone e tablet simultaneamente.",
    priceInCents: 24990,
    stock: 50,
    category: "Acessórios",
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
    ],
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  for (const product of products) {
    const slug = toSlug(product.name);
    await prisma.product.create({
      data: {
        ...product,
        slug,
        active: true,
      },
    });
    console.log(`✅ Created: ${product.name}`);
  }

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
