document.addEventListener("DOMContentLoaded", () => {
    const addItemForm = document.getElementById('add-item-form');
    const editItemForm = document.getElementById('edit-item-form');
    const addInvoiceItemForm = document.getElementById('add-invoice-item-form');
    const productsTableBody = document.getElementById('productsTableBody');
    const invoiceTableBody = document.getElementById('invoiceTableBody');
    const successAlert = document.getElementById('success-alert');
    let itemsInInvoice = [];

    // Fetch and display items on page load
    async function fetchItems() {
        try {
            const response = await fetch('/api/items');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const items = await response.json();
            displayItems(items);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }

    function displayItems(items) {
        productsTableBody.innerHTML = ''; // Clear existing content
        items.forEach(item => {
            const row = document.createElement('tr');
            row.dataset.id = item.item_id;
            row.dataset.name = item.name;
            row.dataset.description = item.description;
            row.dataset.price = item.price;
            row.dataset.cgst = item.cgst;
            row.dataset.sgst = item.sgst;
            row.innerHTML = `
                <td>${item.item_id}</td>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.price}</td>
                <td>${item.cgst}</td>
                <td>${item.sgst}</td>
                <td>
                    <i class="bi bi-pencil edit-item" data-bs-toggle="modal" data-bs-target="#editItemModal"></i>
                    <i class="bi bi-trash delete-item" data-id="${item.item_id}"></i>
                </td>
            `;
            productsTableBody.appendChild(row);
        });

        // Attach event listeners to the dynamically created edit and delete icons
        document.querySelectorAll('.edit-item').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const row = event.target.closest('tr');
                const itemId = row.dataset.id;
                const itemName = row.dataset.name;
                const itemDescription = row.dataset.description;
                const itemPrice = row.dataset.price;
                const itemCgst = row.dataset.cgst;
                const itemSgst = row.dataset.sgst;

                document.getElementById('edit_item_id').value = itemId;
                document.getElementById('edit_name').value = itemName;
                document.getElementById('edit_description').value = itemDescription;
                document.getElementById('edit_price').value = itemPrice;
                document.getElementById('edit_cgst').value = itemCgst;
                document.getElementById('edit_sgst').value = itemSgst;

                $('#editItemModal').modal('show');
            });
        });

        document.querySelectorAll('.delete-item').forEach(icon => {
            icon.addEventListener('click', () => {
                const itemId = icon.getAttribute('data-id');
                if (itemId) {
                    deleteItem(itemId);
                } else {
                    console.error('Item ID is missing for delete.');
                }
            });
        });
    }

    async function addItem(event) {
        event.preventDefault();
        const itemId = document.getElementById('item_id').value;
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const cgst = document.getElementById('cgst').value;
        const sgst = document.getElementById('sgst').value;

        if (!name || !description || !price || !cgst || !sgst) {
            alert('All fields are required.');
            return; // Exit the function if validation fails
        }

        const itemData = { name, description, price, cgst, sgst };
        const method = itemId ? 'PUT' : 'POST';
        const endpoint = itemId ? `/api/items/${itemId}` : '/api/items';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchItems();
            $('#addItemModal').modal('hide');
            document.getElementById('add-item-form').reset();
            showAlert('Item added successfully!');
        } catch (error) {
            console.error('Error adding/updating item:', error);
        }
    }

    async function updateItem(event) {
        event.preventDefault();
        const itemId = document.getElementById('edit_item_id').value;
        const name = document.getElementById('edit_name').value;
        const description = document.getElementById('edit_description').value;
        const price = document.getElementById('edit_price').value;
        const cgst = document.getElementById('edit_cgst').value;
        const sgst = document.getElementById('edit_sgst').value;

        if (!name || !description || !price || !cgst || !sgst) {
            alert('All fields are required.');
            return; // Exit the function if validation fails
        }

        const itemData = { name, description, price, cgst, sgst };

        try {
            const response = await fetch(`/api/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchItems();
            $('#editItemModal').modal('hide');
            showAlert('Item updated successfully!');
        } catch (error) {
            console.error('Error updating item:', error);
        }
    }

    async function deleteItem(itemId) {
        try {
            const response = await fetch(`/api/items/${itemId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchItems();
            showAlert('Item deleted successfully!');
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }

    async function addInvoiceItem(event) {
        event.preventDefault();
        const searchItem = document.getElementById('search_item').value.trim();
    
        if (!searchItem) {
            alert('Please enter an item ID or name.');
            return;
        }
    
        try {
            // Fetch item(s) based on the search query
            const response = await fetch(`/api/items?search=${encodeURIComponent(searchItem)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const items = await response.json();
    
            if (items.length === 0) {
                alert('No items found.');
                return;
            }
    
            // Handle adding the first matching item to the invoice
            addItemToInvoice(items[0]);
    
            $('#addInvoiceItemModal').modal('hide');
            document.getElementById('add-invoice-item-form').reset();
        } catch (error) {
            console.error('Error fetching item for invoice:', error);
        }
    }
    

    function addItemToInvoice(item) {
        // Check if item is already added to the invoice
        if (!itemsInInvoice.find(i => i.item_id === item.item_id)) {
            itemsInInvoice.push(item);
            const row = document.createElement('tr');
            row.dataset.id = item.item_id;
            row.dataset.name = item.name;
            row.dataset.price = item.price;
            row.dataset.cgst = item.cgst;
            row.dataset.sgst = item.sgst;
            row.innerHTML = `
                <td>${item.item_id}</td>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.price}</td>
                <td>${item.cgst}</td>
                <td>${item.sgst}</td>
                <td><input type="number" class="form-control discount" value="0" min="0" step="any" data-type="percentage"></td>
                <td><input type="number" class="form-control quantity" value="1" min="1" step="any"></td>
                <td class="total-price">${item.price}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-item"><i class="bi bi-x"></i></button>
                </td>
            `;
            invoiceTableBody.appendChild(row);

            // Add event listeners for quantity and discount changes
            row.querySelector('.quantity').addEventListener('input', updateTotals);
            row.querySelector('.discount').addEventListener('input', updateTotals);

            // Add event listener for remove button
            row.querySelector('.remove-item').addEventListener('click', () => {
                row.remove();
                itemsInInvoice = itemsInInvoice.filter(i => i.item_id !== item.item_id);
                updateTotals();
            });

            updateTotals(); // Update totals after adding a new item
        } else {
            alert('Item is already added to the invoice.');
        }
    }

    function updateTotals() {
        let subtotal = 0;
        document.querySelectorAll('#invoiceTableBody tr').forEach(row => {
            const price = parseFloat(row.querySelector('.total-price').textContent);
            const quantity = parseFloat(row.querySelector('.quantity').value) || 1;
            const discount = parseFloat(row.querySelector('.discount').value) || 0;
            const discountType = row.querySelector('.discount').dataset.type;

            let totalPrice = price * quantity;

            if (discountType === 'percentage') {
                totalPrice -= (totalPrice * discount) / 100;
            } else {
                totalPrice -= discount;
            }

            row.querySelector('.total-price').textContent = totalPrice.toFixed(2);
            subtotal += totalPrice;
        });

        document.getElementById('subtotal').textContent = subtotal.toFixed(2);

        const discountPercentage = parseFloat(document.getElementById('invoice_discount').value) || 0;
        const discountAmount = (subtotal * discountPercentage) / 100;
        const grandTotal = subtotal - discountAmount;

        document.getElementById('discount_amount').textContent = discountAmount.toFixed(2);
        document.getElementById('grand_total').textContent = grandTotal.toFixed(2);
    }

    function showAlert(message) {
        successAlert.textContent = message;
        successAlert.classList.remove('d-none');
        setTimeout(() => {
            successAlert.classList.add('d-none');
        }, 3000);
    }

    // Event Listeners
    addItemForm.addEventListener('submit', addItem);
    editItemForm.addEventListener('submit', updateItem);
    addInvoiceItemForm.addEventListener('submit', addInvoiceItem);

    // Fetch items on page load
    fetchItems();
});