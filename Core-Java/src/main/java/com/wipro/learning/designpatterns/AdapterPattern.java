package com.wipro.learning.designpatterns;

		

			public class AdapterPattern {
		
			public static void main(String[] args) {
		
				USB usb = new USB();
		
				HDMI adapter = new UsbToHDMIAdapter(usb);
		
				adapter.connectHdmi();
			}
		}
		
		// Target Interface
		interface HDMI {
			void connectHdmi();
		}
		
		// Adaptee (existing system)
		class USB {
			void connectUsb() {
				System.out.println("Connected with USB device!");
			}
		}
		
		// Adapter
		class UsbToHDMIAdapter implements HDMI {
		
			USB device;
		
			public UsbToHDMIAdapter(USB device) {
				this.device = device;
			}
		
			@Override
			public void connectHdmi() {
				System.out.println("Converting HDMI signal to USB...");
				device.connectUsb();
			}
		}