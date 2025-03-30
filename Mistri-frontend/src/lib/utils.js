import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * Merge tailwind classes with clsx and tailwind-merge
 * This helps to resolve conflicting tailwind classes
 * 
 * @param  {...any} inputs - Class names to merge
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a human-readable string
 * 
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
  if (!date) return '';
  
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a time to a human-readable string
 * 
 * @param {Date} date - The date to format
 * @returns {string} - Formatted time string
 */
export function formatTime(date) {
  if (!date) return '';
  
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format price to currency format
 * 
 * @param {number} price - The price to format
 * @returns {string} - Formatted price string
 */
export function formatPrice(price) {
  if (price === undefined || price === null) return '';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Truncate a string to a specified length
 * 
 * @param {string} str - The string to truncate
 * @param {number} length - The maximum length
 * @returns {string} - Truncated string
 */
export function truncateString(str, length = 100) {
  if (!str) return '';
  if (str.length <= length) return str;
  
  return `${str.substring(0, length)}...`;
}
