import React, { useState } from 'react';
import { useReturns } from '../api/useReturns';

export default function Return() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReturn, setEditingReturn] = useState(null);

    const [orderRef, setOrderRef] = useState('');
    const [prodName, setProdName] = useState('');
    const [qty, setQty] = useState(1);
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState('');

    const { returns, addReturn, updateReturn, deleteReturn, isLoading } = useReturns();

    function openModal(item = null) {
        setEditingReturn(item);
        if (item) {
            setOrderRef(item.referenceOrder || '');
            setProdName(item.product || '');
            setQty(item.quantity || 1);
            setReason(item.reason || '');
            setStatus(item.condition || '');
        } else {
            setOrderRef(''); setProdName(''); setQty(1); setReason(''); setStatus('');
        }
        setIsModalOpen(true);
    }

    async function handleSave(e) {
        e.preventDefault();
        const data = {
            referenceOrder: orderRef, product: prodName,
            quantity: qty, reason: reason, condition: status,
            isArchived: editingReturn ? editingReturn.isArchived : false
        };
        if (editingReturn) {
            await updateReturn({ id: editingReturn.id, ...data });
        } else {
            await addReturn(data);
        }
        setIsModalOpen(false);
    }

    function renderTable(list, archived) {
        return (
            <table className="data-table">
                <thead>
                    <tr>
                        <th className="th">Order</th><th className="th">Product</th>
                        <th className="th">Reason</th><th className="th">Qty</th>
                        <th className="th">Status</th><th className="th th-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map(function (item) {
                        return (
                            <tr key={item.id} className="tr">
                                <td className="td td-sku">{item.referenceOrder}</td>
                                <td className="td">{item.product}</td>
                                <td className="td"><span className="badge">{item.reason}</span></td>
                                <td className="td">{item.quantity}</td>
                                <td className="td">{item.condition}</td>
                                <td className="td td-right">
                                    <div className="btn-action-group">
                                        {!archived ? (
                                            <>
                                                <button onClick={function () { openModal(item); }} className="btn-small btn-edit">Edit</button>
                                                <button onClick={async function () { await updateReturn({ id: item.id, isArchived: true }); }} className="btn-small btn-delete">Remove</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={async function () { await updateReturn({ id: item.id, isArchived: false }); }} className="btn-small btn-edit">Restore</button>
                                                <button onClick={async function () { if (window.confirm('Delete?')) await deleteReturn(item.id); }} className="btn-small btn-delete">Delete</button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }

    if (isLoading) return <div className="loading-state">Loading returns...</div>;

    const activeOnes = returns.filter(function (r) { return !r.isArchived; });
    const archivedOnes = returns.filter(function (r) { return r.isArchived; });

    return (
        <div>
            <div className="section-header">
                <div><h1 className="section-title">Returns & Logistics</h1><p className="section-subtitle">Manage customer returns.</p></div>
                <button onClick={function () { openModal(); }} className="btn-primary">+ Log Return</button>
            </div>

            <div className="content-container">
                {activeOnes.length === 0 ? (
                    <div className="empty-state"><p className="empty-text">No active returns.</p></div>
                ) : renderTable(activeOnes, false)}
            </div>

            <div className="section-header archive-header-spacer">
                <div><h1 className="section-title">Archived Returns</h1><p className="section-subtitle">Past return records.</p></div>
                {archivedOnes.length > 0 && (
                    <button
                        onClick={async function () {
                            if (window.confirm('Clear all?')) {
                                for (const r of archivedOnes) {
                                    await deleteReturn(r.id);
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
                ) : renderTable(archivedOnes, true)}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">{editingReturn ? 'Edit Return' : 'New Return'}</h2>
                            <button onClick={function () { setIsModalOpen(false); }} className="modal-close">&times;</button>
                        </div>
                        <form onSubmit={handleSave} className="form-body">
                            <div className="form-row">
                                <div className="form-col"><label className="label">Order Ref</label><input type="text" value={orderRef} onChange={function (e) { setOrderRef(e.target.value); }} required placeholder="ORD-123" className="input" /></div>
                                <div className="form-col"><label className="label">Product Name</label><input type="text" value={prodName} onChange={function (e) { setProdName(e.target.value); }} required placeholder="Product name" className="input" /></div>
                            </div>
                            <div className="form-row">
                                <div className="form-col"><label className="label">Qty</label><input type="number" value={qty} onChange={function (e) { setQty(e.target.value); }} min="1" required className="input" /></div>
                                <div className="form-col"><label className="label">Reason</label><input type="text" value={reason} onChange={function (e) { setReason(e.target.value); }} required placeholder="e.g. Broken" className="input" /></div>
                            </div>
                            <div><label className="label">Condition</label><input type="text" value={status} onChange={function (e) { setStatus(e.target.value); }} required placeholder="e.g. Damaged" className="input" /></div>
                            <div className="form-actions">
                                <button type="button" onClick={function () { setIsModalOpen(false); }} className="btn-cancel">Cancel</button>
                                <button type="submit" className="btn-save">Save Log</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
