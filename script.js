/*
	script.js - API wrapper and client helpers for StudentPaymentWebsite

	This file implements the client-side API calls to the provided Google
	Apps Script endpoint and exposes three main functions globally:

		- loginUser(username, pin)    -> { success: boolean, class?: string, message?: string }
		- getStudents(className)      -> { success: boolean, students?: Array, message?: string }
		- addPayment(paymentObj)      -> { success: boolean, message?: string }

	Notes:
	- This is vanilla JS and intended for front-end usage only.
	- For production, secure the Apps Script endpoint and use server-side
		authentication. Never store sensitive data in client files.
*/

// Google Apps Script endpoint (provided) - updated to user's URL
const API_URL = 'https://script.google.com/macros/s/AKfycbxP8mXmXL5Tyxs4Zou5OV7dbD7mmUJhk4ETGBWUBVs9a49qZz97DpaP3x42MoWEiu2n6w/exec';

// Helper: perform POST request to the API endpoint with JSON body
async function apiRequest(payload) {
	try {
		const res = await fetch(API_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			cache: 'no-store',
		});

		if (!res.ok) {
			return { success: false, message: `Network error: ${res.status} ${res.statusText}` };
		}

		const data = await res.json();
		// Expecting the Apps Script to return a JSON object with at least a `success` field.
		return data;
	} catch (err) {
		return { success: false, message: err.message || 'Unknown error' };
	}
}

// Authenticate user via API. Expects server to respond with { success, class }
async function loginUser(username, pin) {
	username = (username || '').toString().trim();
	pin = (pin || '').toString().trim();

	if (!username || !pin) return { success: false, message: 'Username and PIN required' };

	const payload = { action: 'login', username, pin };
	const resp = await apiRequest(payload);
	if (!resp || !resp.success) {
		return { success: false, message: resp && resp.message ? resp.message : 'Invalid credentials' };
	}

	// resp.class should contain class string (e.g. 'A' or 'ALL')
	return { success: true, class: resp.class };
}

// Fetch students. If className === 'ALL' or omitted, fetch all students.
// Expects server to return { success: true, students: [...] }
async function getStudents(className) {
	const payload = { action: 'getStudents', class: className || 'ALL' };
	const resp = await apiRequest(payload);
	if (!resp || !resp.success) return { success: false, message: resp && resp.message ? resp.message : 'Failed to fetch students' };
	return { success: true, students: resp.students || [] };
}

// Add a payment. paymentObj must include: name, class, amount, mode, date
// Expects server to return { success: true }
async function addPayment(paymentObj) {
	if (!paymentObj || !paymentObj.name || !paymentObj.amount) return { success: false, message: 'Missing payment data' };

	const payload = { action: 'addPayment', payment: paymentObj };
	const resp = await apiRequest(payload);
	if (!resp || !resp.success) return { success: false, message: resp && resp.message ? resp.message : 'Failed to add payment' };
	return { success: true };
}

// Expose functions globally for pages to call
window.loginUser = loginUser;
window.getStudents = getStudents;
window.addPayment = addPayment;

// Small utility: format date string to YYYY-MM-DD (used by forms)
function formatDateForInput(d) {
	const dt = d ? new Date(d) : new Date();
	const yyyy = dt.getFullYear();
	const mm = String(dt.getMonth() + 1).padStart(2, '0');
	const dd = String(dt.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

window.formatDateForInput = formatDateForInput;

