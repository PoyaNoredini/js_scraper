const Category = require('../models/Category');
const CompanyYellow = require('../models/CompanyYellow');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

exports.exportCompaniesByCategory = async (req, res) => {
  try {
    const { categoryName } = req.body; // or req.query/categoryName if GET

    // Find the category
    const category = await Category.findOne({ where: { name: categoryName } });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Get companies in this category
    const companies = await CompanyYellow.findAll({
      where: { category_id: category.id }
    });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Companies');

    // Add header row
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Website', key: 'link_web', width: 30 },
      { header: 'Phone', key: 'phone_number', width: 20 },
      { header: 'Yellow Page Link', key: 'link_yellow_page', width: 30 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Instagram', key: 'instagram_link', width: 30 },
      { header: 'Facebook', key: 'facebook_link', width: 30 },
      { header: 'LinkedIn', key: 'linkedin_link', width: 30 },
      { header: 'WhatsApp', key: 'whatsapp_link', width: 30 },
      { header: 'Twitter', key: 'twitter_link', width: 30 },
      { header: 'Business Hours', key: 'business_hours', width: 20 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'Category ID', key: 'category_id', width: 10 },
      { header: 'Subcategory', key: 'sub_category', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 },
    ];

    // Add data rows
    companies.forEach(company => {
      worksheet.addRow(company.dataValues);
    });

 // Define file path
 const fileName = `companies_${categoryName}_${Date.now()}.xlsx`;
 const filePath = path.join(__dirname, '../public/exports', fileName);

 // Ensure the exports directory exists
 fs.mkdirSync(path.dirname(filePath), { recursive: true });


    // Write the file to disk
    await workbook.xlsx.writeFile(filePath);

    // Return the download link
    const downloadUrl = `/exports/${fileName}`;
    res.json({ downloadUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};