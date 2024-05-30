"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const YouTubeApi = (gameName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        yield page.goto(`https://www.youtube.com/results?search_query=${gameName}+gameplay`);
        yield page.waitForSelector('ytd-video-renderer');
        const fetchedVideos = yield page.evaluate(() => {
            const videoContainers = Array.from(document.querySelectorAll('ytd-video-renderer'));
            return videoContainers.slice(0, 2).map((container) => {
                const titleElement = container.querySelector('#video-title');
                const thumbnailElement = container.querySelector('yt-image');
                const imgElement = thumbnailElement === null || thumbnailElement === void 0 ? void 0 : thumbnailElement.querySelector('img');
                const thumbnailSrc = (imgElement === null || imgElement === void 0 ? void 0 : imgElement.getAttribute('src')) || '';
                const title = (titleElement === null || titleElement === void 0 ? void 0 : titleElement.textContent) || '';
                const id = ((titleElement === null || titleElement === void 0 ? void 0 : titleElement.href) || '').split('v=')[1] || '';
                const thumbnail = thumbnailSrc || '';
                return { title, id, thumbnail };
            });
        });
        yield browser.close();
        return fetchedVideos;
    }
    catch (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
});
exports.default = YouTubeApi;
