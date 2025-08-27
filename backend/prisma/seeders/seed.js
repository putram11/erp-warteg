const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.paymentRecord.deleteMany();
  await prisma.customerDebt.deleteMany();
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.stockHistory.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️ Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create owner
  const owner = await prisma.user.create({
    data: {
      email: 'owner@warteg.com',
      password: hashedPassword,
      name: 'Ibu Sari (Pemilik)',
      phone: '081234567890',
      address: 'Jl. Sudirman No. 123, Jakarta',
      role: 'OWNER'
    }
  });

  // Create employees
  const employee1 = await prisma.user.create({
    data: {
      email: 'employee1@warteg.com',
      password: hashedPassword,
      name: 'Budi (Tukang Cuci)',
      phone: '081234567891',
      address: 'Jl. Kebon Jeruk No. 45, Jakarta',
      role: 'EMPLOYEE'
    }
  });

  const employee2 = await prisma.user.create({
    data: {
      email: 'employee2@warteg.com',
      password: hashedPassword,
      name: 'Siti (Kasir)',
      phone: '081234567892',
      address: 'Jl. Mangga Dua No. 67, Jakarta',
      role: 'EMPLOYEE'
    }
  });

  // Create customers
  const customers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'customer1@example.com',
        password: hashedPassword,
        name: 'Pak Joko',
        phone: '081234567893',
        address: 'Jl. Matraman No. 89, Jakarta',
        role: 'CUSTOMER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'customer2@example.com',
        password: hashedPassword,
        name: 'Bu Ani',
        phone: '081234567894',
        address: 'Jl. Cikini No. 12, Jakarta',
        role: 'CUSTOMER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'customer3@example.com',
        password: hashedPassword,
        name: 'Mas Rudi',
        phone: '081234567895',
        address: 'Jl. Thamrin No. 34, Jakarta',
        role: 'CUSTOMER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'customer4@example.com',
        password: hashedPassword,
        name: 'Mbak Rina',
        phone: '081234567896',
        address: 'Jl. Senayan No. 56, Jakarta',
        role: 'CUSTOMER'
      }
    })
  ]);

  console.log('👥 Created users');

  // Create menus
  const menus = await Promise.all([
    // Nasi
    prisma.menu.create({
      data: {
        name: 'Nasi Putih',
        category: 'NASI',
        price: 3000,
        description: 'Nasi putih hangat',
        stock: 100,
        isAvailable: true
      }
    }),
    prisma.menu.create({
      data: {
        name: 'Nasi Uduk',
        category: 'NASI',
        price: 5000,
        description: 'Nasi uduk gurih dengan santan',
        stock: 50,
        isAvailable: true
      }
    }),

    // Lauk
    prisma.menu.create({
      data: {
        name: 'Tempe Goreng',
        category: 'LAUK',
        price: 2000,
        description: 'Tempe goreng krispy',
        stock: 30,
        isAvailable: true
      }
    }),
    prisma.menu.create({
      data: {
        name: 'Tahu Goreng',
        category: 'LAUK',
        price: 2000,
        description: 'Tahu goreng garing',
        stock: 25,
        isAvailable: true
      }
    }),
    prisma.menu.create({
      data: {
        name: 'Ayam Bakar',
        category: 'LAUK',
        price: 15000,
        description: 'Ayam bakar bumbu kecap',
        stock: 20,
        isAvailable: true
      }
    }),
    prisma.menu.create({
      data: {
        name: 'Ayam Goreng',
        category: 'LAUK',
        price: 12000,
        description: 'Ayam goreng krispy',
        stock: 15,
        isAvailable: true
      }
    }),
    prisma.menu.create({
      data: {
        name: 'Ikan Lele Goreng',
        category: 'LAUK',
        price: 8000,
        description: 'Lele goreng tepung',
        stock: 18,
        isAvailable: true
      }
    }),
    prisma.menu.create({
      data: {
        name: 'Telur Dadar',
        category: 'LAUK',
        price: 5000,
        description: 'Telur dadar sederhana',
        stock: 12,
        isAvailable: true
      }
    }),

    // Sambal
    prisma.menu.create({
      data: {
        name: 'Sambal Ijo',
        category: 'SAMBAL',
        price: 1000,
        description: 'Sambal hijau pedas',
        stock: 50,
        isAvailable: true
      }
    }),
    prisma.menu.create({
      data: {
        name: 'Sambal Merah',
        category: 'SAMBAL',
        price: 1000,
        description: 'Sambal merah tradisional',
        stock: 45,
        isAvailable: true
      }
    }),
    prisma.menu.create({
      data: {
        name: 'Sambal Terasi',
        category: 'SAMBAL',
        price: 1500,
        description: 'Sambal terasi harum',
        stock: 30,
        isAvailable: true
      }
    }),

    // Sayur
    prisma.menu.create({
      data: {
        name: 'Sayur Asem',
        category: 'SAYUR',
        price: 4000,
        description: 'Sayur asem segar',
        stock: 25,
        isAvailable: true
      }
    }),
    prisma.menu.create({
      data: {
        name: 'Kangkung Tumis',
        category: 'SAYUR',
        price: 3500,
        description: 'Kangkung tumis belacan',
        stock: 20,
        isAvailable: true
      }
    }),
    prisma.menu.create({
      data: {
        name: 'Gado-gado',
        category: 'SAYUR',
        price: 8000,
        description: 'Gado-gado komplit',
        stock: 15,
        isAvailable: true
      }
    }),

    // Minuman
    prisma.menu.create({
      data: {
        name: 'Es Teh Manis',
        category: 'MINUMAN',
        price: 3000,
        description: 'Es teh manis segar',
        stock: 40,
        isAvailable: true
      }
    }),
    prisma.menu.create({
      data: {
        name: 'Kopi Hitam',
        category: 'MINUMAN',
        price: 2500,
        description: 'Kopi hitam tubruk',
        stock: 35,
        isAvailable: true
      }
    }),
    prisma.menu.create({
      data: {
        name: 'Jus Jeruk',
        category: 'MINUMAN',
        price: 5000,
        description: 'Jus jeruk segar',
        stock: 20,
        isAvailable: true
      }
    }),
    prisma.menu.create({
      data: {
        name: 'Air Mineral',
        category: 'MINUMAN',
        price: 2000,
        description: 'Air mineral dingin',
        stock: 60,
        isAvailable: true
      }
    })
  ]);

  console.log('🍛 Created menus');

  // Create stock histories for initial stock
  const stockHistories = await Promise.all(
    menus.map(menu => 
      prisma.stockHistory.create({
        data: {
          menuId: menu.id,
          quantity: menu.stock,
          type: 'RESTOCK',
          description: 'Initial stock'
        }
      })
    )
  );

  console.log('📦 Created stock histories');

  // Create sample transactions
  const transactions = [];

  // Generate transactions for the last 30 days
  for (let i = 30; i >= 0; i--) {
    const transactionDate = new Date();
    transactionDate.setDate(transactionDate.getDate() - i);
    
    // Random number of transactions per day (1-5)
    const transactionsPerDay = Math.floor(Math.random() * 5) + 1;
    
    for (let j = 0; j < transactionsPerDay; j++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const paymentMethod = ['CASH', 'TRANSFER', 'DEBT'][Math.floor(Math.random() * 3)];
      
      // Random transaction time
      const transactionTime = new Date(transactionDate);
      transactionTime.setHours(
        Math.floor(Math.random() * 12) + 8, // 8 AM to 8 PM
        Math.floor(Math.random() * 60)
      );

      // Random menu items (1-4 items per transaction)
      const itemCount = Math.floor(Math.random() * 4) + 1;
      const selectedMenus = [];
      const usedMenuIds = new Set();

      for (let k = 0; k < itemCount; k++) {
        let randomMenu;
        do {
          randomMenu = menus[Math.floor(Math.random() * menus.length)];
        } while (usedMenuIds.has(randomMenu.id));
        
        usedMenuIds.add(randomMenu.id);
        selectedMenus.push({
          menuId: randomMenu.id,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: randomMenu.price
        });
      }

      const totalAmount = selectedMenus.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      const transaction = await prisma.transaction.create({
        data: {
          customerId: customer.id,
          employeeId: j % 2 === 0 ? employee1.id : employee2.id,
          totalAmount,
          paidAmount: paymentMethod === 'CASH' ? totalAmount : 
                     paymentMethod === 'TRANSFER' ? totalAmount :
                     Math.random() < 0.3 ? totalAmount * 0.5 : 0, // Some partial payments for debt
          status: paymentMethod === 'CASH' || paymentMethod === 'TRANSFER' ? 'COMPLETED' :
                  Math.random() < 0.3 ? 'PARTIAL' : 'PENDING',
          paymentMethod,
          notes: j % 3 === 0 ? 'Pelanggan tetap' : null,
          createdAt: transactionTime,
          transactionItems: {
            create: selectedMenus.map(item => ({
              menuId: item.menuId,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity
            }))
          }
        }
      });

      transactions.push(transaction);

      // Create debt record if payment method is DEBT
      if (paymentMethod === 'DEBT') {
        const remainingDebt = totalAmount - transaction.paidAmount;
        if (remainingDebt > 0) {
          await prisma.customerDebt.create({
            data: {
              customerId: customer.id,
              transactionId: transaction.id,
              totalDebt: totalAmount,
              remainingDebt,
              isSettled: remainingDebt === 0
            }
          });

          // Add some payment records for partial payments
          if (transaction.paidAmount > 0) {
            await prisma.paymentRecord.create({
              data: {
                customerDebtId: (await prisma.customerDebt.findUnique({
                  where: { transactionId: transaction.id }
                })).id,
                transactionId: transaction.id,
                userId: employee1.id,
                amount: transaction.paidAmount,
                paymentMethod: 'CASH',
                notes: 'Pembayaran sebagian',
                createdAt: transactionTime
              }
            });
          }
        }
      }

      // Update stock for each item
      for (const item of selectedMenus) {
        await prisma.stockHistory.create({
          data: {
            menuId: item.menuId,
            quantity: -item.quantity,
            type: 'SALE',
            description: `Sale from transaction ${transaction.id}`,
            createdAt: transactionTime
          }
        });

        // Update menu stock
        await prisma.menu.update({
          where: { id: item.menuId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }
    }
  }

  console.log('💰 Created transactions');

  // Add some additional payment records for debt settlements
  const activeDebts = await prisma.customerDebt.findMany({
    where: { isSettled: false },
    take: 5
  });

  for (const debt of activeDebts) {
    if (Math.random() < 0.6) { // 60% chance of additional payment
      const paymentAmount = Math.min(
        debt.remainingDebt, 
        Math.floor(Math.random() * debt.remainingDebt * 0.8) + debt.remainingDebt * 0.2
      );
      
      const paymentDate = new Date();
      paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 10));

      await prisma.paymentRecord.create({
        data: {
          customerDebtId: debt.id,
          transactionId: debt.transactionId,
          userId: employee2.id,
          amount: paymentAmount,
          paymentMethod: 'CASH',
          notes: 'Cicilan utang',
          createdAt: paymentDate
        }
      });

      // Update debt
      const newRemainingDebt = debt.remainingDebt - paymentAmount;
      await prisma.customerDebt.update({
        where: { id: debt.id },
        data: {
          remainingDebt: newRemainingDebt,
          isSettled: newRemainingDebt === 0
        }
      });

      // Update transaction
      await prisma.transaction.update({
        where: { id: debt.transactionId },
        data: {
          paidAmount: {
            increment: paymentAmount
          },
          status: newRemainingDebt === 0 ? 'COMPLETED' : 'PARTIAL'
        }
      });
    }
  }

  console.log('💳 Created additional payment records');

  console.log('✅ Database seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${await prisma.user.count()}`);
  console.log(`- Menus: ${await prisma.menu.count()}`);
  console.log(`- Transactions: ${await prisma.transaction.count()}`);
  console.log(`- Customer Debts: ${await prisma.customerDebt.count()}`);
  console.log(`- Payment Records: ${await prisma.paymentRecord.count()}`);
  
  console.log('\n🔐 Login credentials:');
  console.log('Owner: owner@warteg.com / password123');
  console.log('Employee: employee1@warteg.com / password123');
  console.log('Customer: customer1@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
