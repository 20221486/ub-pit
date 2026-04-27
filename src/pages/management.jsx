import React, { useState } from 'react';
import { useProducts } from '../api/useProducts';
import { useReturns } from '../api/useReturns';

export default function Management() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [barcode, setBarcode] = useState('');
    const [desc, setDesc] = useState('');
    const [cat, setCat] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [imgUrl, setImgUrl] = useState('');

    const { products, addProduct, updateProduct, deleteProduct, uploadImage, isLoading } = useProducts();
    const { addReturn } = useReturns();

    function openModal(item = null) {
        setEditingItem(item);
        if (item) {
            setName(item.productName || '');
            setSku(item.sku || '');
            setBarcode(item.barcode || '');
            setDesc(item.description || '');
            setCat(item.category || '');
            setImgUrl(item.imageUrl || '');
            setImgFile(null);
        } else {
            setName(''); setSku(''); setBarcode(''); setDesc(''); setCat(''); setImgUrl(''); setImgFile(null);
        }
        setIsModalOpen(true);
    }

    async function handleSave(e) {
        e.preventDefault();

        let finalImgUrl = imgUrl;
        if (imgFile) {
            try {
                finalImgUrl = await uploadImage(imgFile);
            } catch (err) {
                alert('Failed to upload image');
                return;
            }
        }

        const data = {
            productName: name, sku: sku, barcode: barcode,
            description: desc, category: cat || 'Uncategorized', imageUrl: finalImgUrl,
            isArchived: editingItem ? editingItem.isArchived : false
        };

        if (editingItem) {
            await updateProduct({ id: editingItem.id, ...data });
        } else {
            await addProduct(data);
        }
        setIsModalOpen(false);
    }

    async function handleLog(product) {
        const reason = window.prompt('Reason for return?', 'Defective');
        if (reason === null) return;
        const qty = window.prompt('How many?', '1');
        if (qty === null) return;

        await addReturn({
            referenceOrder: 'LOG-' + (product.sku || 'N/A'),
            product: product.productName,
            quantity: parseInt(qty) || 1,
            reason: reason,
            condition: 'Pending'
        });

        await updateProduct({ id: product.id, isArchived: true });
        alert('Logged and Archived!');
    }

    function renderRows(list, archived) {
        return list.map(function (p) {
            return (
                <tr key={p.id} className="tr">
                    <td className="td">
                        <div className="product-cell-content">
                            {p.imageUrl ? (
                                <img src={p.imageUrl} alt="pic" className="product-thumbnail" />
                            ) : (
                                <div className="product-thumbnail-placeholder">Empty</div>
                            )}
                            <span>{p.productName}</span>
                        </div>
                    </td>
                    <td className="td td-sku">{p.sku}</td>
                    <td className="td"><span className="badge">{p.category}</span></td>
                    <td className={p.description ? 'td td-desc' : 'td td-desc td-desc-empty'} title={p.description || 'No description'}>
                        {p.description || 'No description'}
                    </td>
                    <td className="td td-right">
                        <div className="btn-action-group">
                            <button onClick={function () { handleLog(p); }} className="btn-small btn-log">Log</button>
                            {!archived ? (
                                <>
                                    <button onClick={function () { openModal(p); }} className="btn-small btn-edit">Edit</button>
                                    <button onClick={async function () { if (window.confirm('Archive?')) await updateProduct({ id: p.id, isArchived: true }); }} className="btn-small btn-delete">Remove</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={async function () { await updateProduct({ id: p.id, isArchived: false }); }} className="btn-small btn-edit">Restore</button>
                                    <button onClick={async function () { if (window.confirm('Delete?')) await deleteProduct(p.id); }} className="btn-small btn-delete">Delete</button>
                                </>
                            )}
                        </div>
                    </td>
                </tr>
            );
        });
    }

    if (isLoading) return <div className="loading-state">Loading inventory...</div>;

    const activeOnes = products.filter(function (p) { return !p.isArchived; });
    const archivedOnes = products.filter(function (p) { return p.isArchived; });

    return (
        <div>
            <div className="section-header">
                <div><h1 className="section-title">Product Management</h1><p className="section-subtitle">Active inventory items.</p></div>
                <button onClick={function () { openModal(); }} className="btn-primary">+ Add New</button>
            </div>

            <div className="content-container">
                {activeOnes.length === 0 ? (
                    <div className="empty-state"><p className="empty-text">No active products.</p></div>
                ) : (
                    <table className="data-table">
                        <thead><tr><th className="th">Product</th><th className="th">SKU</th><th className="th">Category</th><th className="th">Description</th><th className="th th-right">Actions</th></tr></thead>
                        <tbody>{renderRows(activeOnes, false)}</tbody>
                    </table>
                )}
            </div>

            <div className="section-header archive-header-spacer">
                <div><h1 className="section-title">Archived Items</h1><p className="section-subtitle">Removed from inventory.</p></div>
                {archivedOnes.length > 0 && (
                    <button
                        onClick={async function () {
                            if (window.confirm('Clear all?')) {
                                for (const p of archivedOnes) {
                                    await deleteProduct(p.id);
                                }
                            }
                        }}
                        className="btn-primary"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="content-container">
                {archivedOnes.length === 0 ? (
                    <div className="empty-state"><p className="empty-text">Archive is empty.</p></div>
                ) : (
                    <table className="data-table">
                        <thead><tr><th className="th">Product</th><th className="th">SKU</th><th className="th">Category</th><th className="th">Description</th><th className="th th-right">Actions</th></tr></thead>
                        <tbody>{renderRows(archivedOnes, true)}</tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">{editingItem ? 'Edit Item' : 'New Item'}</h2>
                            <button onClick={function () { setIsModalOpen(false); }} className="modal-close">&times;</button>
                        </div>
                        <form onSubmit={handleSave} className="form-body">
                            <div><label className="label">Name *</label><input type="text" value={name} onChange={function (e) { setName(e.target.value); }} required placeholder="Name" className="input" /></div>
                            <div className="form-row">
                                <div className="form-col"><label className="label">SKU *</label><input type="text" value={sku} onChange={function (e) { setSku(e.target.value); }} required placeholder="SKU" className="input" /></div>
                                <div className="form-col"><label className="label">Barcode</label><input type="text" value={barcode} onChange={function (e) { setBarcode(e.target.value); }} placeholder="Barcode" className="input" /></div>
                            </div>
                            <div><label className="label">Description</label><textarea value={desc} onChange={function (e) { setDesc(e.target.value); }} rows={2} placeholder="Info" className="textarea" /></div>
                            <div className="form-row">
                                <div className="form-col"><label className="label">Category</label><input type="text" value={cat} onChange={function (e) { setCat(e.target.value); }} placeholder="Category" className="input" /></div>
                                <div className="form-col">
                                    <label className="label">Product Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={function (e) { setImgFile(e.target.files[0]); }}
                                        className="input"
                                    />
                                    {imgUrl && !imgFile && <p className="input-hint">Current: {imgUrl.split('/').pop()}</p>}
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={function () { setIsModalOpen(false); }} className="btn-cancel">Cancel</button>
                                <button type="submit" className="btn-save">Save Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
