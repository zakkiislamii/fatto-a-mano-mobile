import axios from "axios";
import { Sheets } from "../models/sheets";

export class ExcelService {
  private readonly url: string = process.env.EXPO_PUBLIC_SHEETY_URL || "";
  private readonly uid: string;
  private id?: number;
  private email: string = "";
  private nama: string = "";
  private nik: string = "";
  private nomor_hp: string = "";
  private divisi: string = "";
  private hari_kerja: string = "";
  private jam_masuk: string = "";
  private jam_keluar: string = "";
  private is_wfh: boolean = false;

  public constructor(uid: string) {
    this.uid = uid;
  }

  public getId(): number | undefined {
    return this.id;
  }

  public getUid(): string {
    return this.uid;
  }

  public getEmail(): string {
    return this.email;
  }

  public getNama(): string {
    return this.nama;
  }

  public getNik(): string {
    return this.nik;
  }

  public getNomorHp(): string {
    return this.nomor_hp;
  }

  public getDivisi(): string {
    return this.divisi;
  }

  public getHariKerja(): string {
    return this.hari_kerja;
  }

  public getJamMasuk(): string {
    return this.jam_masuk;
  }

  public getJamKeluar(): string {
    return this.jam_keluar;
  }

  public getIsWfh(): boolean {
    return this.is_wfh;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public setEmail(email: string): void {
    this.email = (email ?? "").trim();
  }

  public setNama(nama: string): void {
    this.nama = (nama ?? "").trim();
  }

  public setNik(nik: string): void {
    this.nik = (nik ?? "").trim();
  }

  public setNomorHp(nomor: string): void {
    this.nomor_hp = (nomor ?? "").trim();
  }

  public setDivisi(divisi: string): void {
    this.divisi = (divisi ?? "").trim();
  }

  public setHariKerja(hari_kerja: string): void {
    this.hari_kerja = (hari_kerja ?? "").trim();
  }

  public setJamMasuk(jam: string): void {
    this.jam_masuk = (jam ?? "").trim();
  }

  public setJamKeluar(jam: string): void {
    this.jam_keluar = (jam ?? "").trim();
  }

  public setIsWfh(is_wfh: boolean): void {
    this.is_wfh = !!is_wfh;
  }

  public async getRows(): Promise<Sheets[]> {
    try {
      const response = await axios.get(this.url);
      return response.data.sheet1;
    } catch (error) {
      console.error("Error retrieving rows:", error);
      throw error;
    }
  }

  public async addRow(): Promise<void> {
    try {
      const rowData: Sheets = {
        uid: this.uid,
        email: this.email,
        nama: this.nama,
        nik: this.nik,
        nomorHp: this.nomor_hp,
        divisi: this.divisi,
        hariKerja: this.hari_kerja,
        jamMasuk: this.jam_masuk,
        jamKeluar: this.jam_keluar,
        isWfh: this.is_wfh,
      };
      const response = await axios.post(this.url, {
        sheet1: rowData,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding row:", error);
      throw error;
    }
  }

  public async editRow(): Promise<void> {
    try {
      if (!this.id) {
        throw new Error("ID tidak tersedia untuk edit row.");
      }

      const payload: Sheets = {
        uid: this.uid,
        email: this.email,
        nama: this.nama,
        nik: this.nik,
        nomorHp: this.nomor_hp,
        divisi: this.divisi,
        hariKerja: this.hari_kerja,
        jamMasuk: this.jam_masuk,
        jamKeluar: this.jam_keluar,
        isWfh: this.is_wfh,
      };

      const response = await axios.put(`${this.url}/${this.id}`, {
        sheet1: payload,
      });
      return response.data;
    } catch (error) {
      console.error("Error editing row:", error);
      throw error;
    }
  }
}
